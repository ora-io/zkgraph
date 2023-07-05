export function encode(input) {
  if (Array.isArray(input)) {
    const output = [];
    for (let i = 0; i < input.length; i++) {
      output.push(encode(input[i]));
    }
    const buf = concatBytes(...output);
    return concatBytes(encodeLength(buf.length, 192), buf);
  }
  const inputBuf = toBytes(input);
  if (inputBuf.length === 1 && inputBuf[0] < 128) {
    return inputBuf;
  }
  return concatBytes(encodeLength(inputBuf.length, 128), inputBuf);
}

function decodeLength(v) {
  if (v[0] === 0) {
    throw new Error("invalid RLP: extra zeros");
  }
  return parseHexByte(bytesToHex(v));
}

function encodeLength(len, offset) {
  if (len < 56) {
    return Uint8Array.from([len + offset]);
  }
  const hexLength = numberToHex(len);
  const lLength = hexLength.length / 2;
  const firstByte = numberToHex(offset + 55 + lLength);
  return Uint8Array.from(hexToBytes(firstByte + hexLength));
}

export function decode(input, stream = false) {
  if (!input || input.length === 0) {
    return Uint8Array.from([]);
  }

  const inputBytes = toBytes(input);
  const decoded = _decode(inputBytes, 0);

  if (stream) {
    return decoded;
  }

  return decoded.data;
}

function _decode(input, start) {
  let length, llength, data;
  const firstByte = input[start];

  if (firstByte <= 0x7f) {
    // SINGLE_CHAR
    return {
      data: input.slice(start, start + 1),
      dataIndexes: [start, start],
      isList: false,
    };
  } else if (firstByte <= 0xb7) {
    // SHORT_STRING
    length = firstByte - 0x80;
    if (firstByte === 0x80) {
      data = Uint8Array.from([]); // empty string
    } else {
      data = input.slice(start + 1, start + 1 + length);
    }

    if (length === 2 && data[start] < 0x80) {
      throw new Error(
        "invalid RLP encoding: invalid prefix, single byte < 0x80 are not prefixed"
      );
    }

    return {
      data: data,
      dataIndexes: [start + 1, start + length],
      isList: false,
    };
  } else if (firstByte <= 0xbf) {
    // LONG_STRING
    llength = firstByte - 0xb7;
    if (input.length - start - 1 < llength) {
      throw new Error("invalid RLP: not enough bytes for string length");
    }
    length = decodeLength(input.slice(start + 1, start + 1 + llength));
    if (length <= 55) {
      throw new Error(
        "invalid RLP: expected string length to be greater than 55"
      );
    }
    data = input.slice(start + 1 + llength, start + 1 + length + llength);

    return {
      data: data,
      dataIndexes: [start + 1 + llength, start + length + llength],
      isList: false,
    };
  } else if (firstByte <= 0xf7) {
    // SHORT_LIST
    length = firstByte - 0xc0;
    return {
      data: _decodeList(input, start + 1, start + length),
      dataIndexes: [start + 1, start + length],
      isList: true,
    };
  } else {
    // LONG_LIST
    llength = firstByte - 0xf7;
    length = decodeLength(input.slice(start + 1, start + 1 + llength));
    if (length < 56) {
      throw new Error("invalid RLP: encoded list too short");
    }
    const totalLength = llength + length;
    if (start + totalLength > input.length) {
      throw new Error("invalid RLP: total length is larger than the data");
    }

    return {
      data: _decodeList(input, start + llength + 1, start + length + llength),
      dataIndexes: [start + llength + 1, start + totalLength],
      isList: true,
    };
  }
}

function _decodeList(input, start, end) {
  var startIdx = start;
  const decoded = [];
  while (startIdx <= end) {
    var d = _decode(input, startIdx);
    decoded.push(d);
    startIdx = d.dataIndexes[1] + 1;
  }
  if (startIdx != end + 1) {
    throw new Error("invalid RLP: decode list input invalid");
  }
  return decoded;
}

const cachedHexes = Array.from({ length: 256 }, function (_v, i) {
  return i.toString(16).padStart(2, "0");
});

function bytesToHex(uint8a) {
  let hex = "";
  for (let i = 0; i < uint8a.length; i++) {
    hex += cachedHexes[uint8a[i]];
  }
  return hex;
}

function parseHexByte(hexByte) {
  const byte = Number.parseInt(hexByte, 16);
  if (Number.isNaN(byte)) throw new Error("Invalid byte sequence");
  return byte;
}

function hexToBytes(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("hexToBytes: expected string, got " + typeof hex);
  }
  if (hex.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex");
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    array[i] = parseHexByte(hex.slice(j, j + 2));
  }
  return array;
}

function concatBytes(...arrays) {
  if (arrays.length === 1) return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}

function utf8ToBytes(utf) {
  return new TextEncoder().encode(utf);
}

function numberToHex(integer) {
  if (integer < 0) {
    throw new Error("Invalid integer as argument, must be unsigned!");
  }
  const hex = integer.toString(16);
  return hex.length % 2 ? `0${hex}` : hex;
}

function padToEven(a) {
  return a.length % 2 ? `0${a}` : a;
}

function isHexPrefixed(str) {
  return str.length >= 2 && str[0] === "0" && str[1] === "x";
}

function stripHexPrefix(str) {
  if (typeof str !== "string") {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
}

function toBytes(v) {
  if (v instanceof Uint8Array) {
    return v;
  }
  if (typeof v === "string") {
    if (isHexPrefixed(v)) {
      return hexToBytes(padToEven(stripHexPrefix(v)));
    }
    return utf8ToBytes(v);
  }
  if (typeof v === "number" || typeof v === "bigint") {
    if (!v) {
      return Uint8Array.from([]);
    }
    return hexToBytes(numberToHex(v));
  }
  if (v === null || v === undefined) {
    return Uint8Array.from([]);
  }
  throw new Error("toBytes: received unsupported type " + typeof v);
}

const utils = {
  bytesToHex,
  concatBytes,
  hexToBytes,
  utf8ToBytes,
};

const RLP = { encode, decode };
export default RLP;
