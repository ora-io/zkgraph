import BN from "bn.js";

export function fromHexString(hexString) {
  hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  hexString = hexString.length % 2 ? "0" + hexString : hexString;
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

export function toHexString(bytes) {
  return Buffer.from(bytes).toString("hex");
}

export function toHexStringBytes32Reverse(arr) {
  let result = "";
  for (let i = 0; i < arr.length / 32; i++) {
    result +=
      "0x" + toHexString(arr.slice(i * 32, (i + 1) * 32).reverse()) + "\n";
  }
  return result;
}

export function areEqualArrays(first, second) {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

export function trimPrefix(str, prefix) {
  if (str.startsWith(prefix)) {
    str = str.substring(prefix.length);
  }
  return str;
}

export function logDivider() {
  const line = "=".repeat(process.stdout.columns);
  console.log(line);
}

export function logLoadingAnimation() {
  // If width is equal to process.stdout.columns, the bar will overflow into the next line.
  // 4 is the length of the prefix "[*] ".
  // 55 is about the same length as the longest message in this script.
  const width = Math.min(process.stdout.columns - 4, 55);
  let frame = 0;
  let stop = false;

  const frames = ["▓"];
  let position = 0;
  const intervalId = setInterval(() => {
    if (stop) {
      clearInterval(intervalId);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      return;
    }

    const currentFrame = frames[frame % frames.length];
    const loadingBar = `[*] ${currentFrame.repeat(
      position,
    )}▒${currentFrame.repeat(width - position - 1)}`;

    process.stdout.cursorTo(0);
    process.stdout.write(loadingBar);

    position = (position + 1) % width;

    frame++;
  }, 400);

  return {
    stopAndClear: () => {
      stop = true;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    },
  };
}

export function concatHexStrings(hexStrings) {
  let result = "";
  for (let hexString of hexStrings) {
    result += hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  }
  return "0x" + result;
}

export function currentNpmScriptName() {
  return process.env.npm_lifecycle_event;
}

export function logReceiptAndEvents(
  rawreceiptList,
  blockid,
  matchedEventOffsets,
  filteredEventList,
) {
  console.log(
    "[*]",
    rawreceiptList.length,
    rawreceiptList.length > 1
      ? "receipts fetched from block"
      : "receipt fetched from block",
    blockid,
  );
  console.log(
    "[*]",
    matchedEventOffsets.length / 7,
    matchedEventOffsets.length / 7 > 1 ? "events matched" : "event matched",
  );
  for (let i in filteredEventList) {
    for (let j in filteredEventList[i]) {
      filteredEventList[i][j].prettyPrint(
        "\tTx[" + i + "]Event[" + j + "]",
        false,
      );
    }
  }
}

export function parseArgs(raw) {
  let parsedInputs = new Array();
  for (var input of raw) {
      input = input.trim();
      if (input!=="") {
          let args = parseArg(input);
          if (args!=null) {
              parsedInputs.push(args);
          } else {
              throw Error(`invalid args in ${input}`);
          }
      }
  }
  return parsedInputs.flat();
}

export function parseArg(input) {
  let inputArray = input.split(":");
  let value = inputArray[0];
  let type = inputArray[1];
  let re1 = new RegExp(/^[0-9A-Fa-f]+$/); // hexdecimal
  let re2 = new RegExp(/^\d+$/); // decimal

  // Check if value is a number
  if(!(re1.test(value.slice(2)) || re2.test(value))) {
      console.log("Error: input value is not an interger number");
      return null;
  }

  // Convert value byte array
  if(type == "i64") {
      let v;
      if(value.slice(0, 2) == "0x") {
          v = new BN(value.slice(2), 16);
      } else {
          v = new BN(value);
      }
      return [v];
  } else if(type == "bytes" || type == "bytes-packed") {
      if(value.slice(0, 2) != "0x") {
          console.log("Error: bytes input need start with 0x");
          return null;
      }
      let bytes = hexToBNs(value.slice(2));
      return bytes;
  } else {
      console.log("Unsupported input data type: %s", type);
      return null;
  }
}

// Convert a hex string to a byte array
export function hexToBNs(hexString){
  let bytes = new Array(hexString.length/2);
  for (var i = 0; i < hexString.length; i += 2) {
      bytes[i] = new BN(hexString.slice(i, i+2), 16);
  }
  return bytes;
}

export function bytesToBN(data) {
  let chunksize = 64;
  let bns = [];
  for (let i = 0; i < data.length; i += 32) {
      const chunk = data.slice(i, i + 32);
      let a = new BN(chunk,'le');
      bns.push(a);
      // do whatever
  }
  return bns;
}
