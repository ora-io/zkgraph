// Implementation for
// (https://github.com/graphprotocol/graph-tooling/blob/dcc246333397952506a9db6a6c556fc57b8017c2/packages/ts/common/numbers.ts#L6)
// For The Graph, they appear to be implemented in the node
// (https://github.com/graphprotocol/graph-node/blob/252e9129588b0b022bcaf50bbe365287db18241b/runtime/wasm/src/module/mod.rs#LL1551C18-L1551C18)
// Need optimization for zkWASM
import { BigInt } from "../type";

export function plus(x: BigInt, y: BigInt): BigInt {
  const result = new BigInt(x.length > y.length ? x.length : y.length);
  let carry = 0;

  for (let i = 0; i < result.length; i++) {
    const sum = (x[i] || 0) + (y[i] || 0) + carry;
    result[i] = sum & 0xff;
    carry = sum >> 8;
  }

  if (carry) {
    result[result.length] = carry;
  }

  return result;
}

export function minus(x: BigInt, y: BigInt): BigInt {
  const result = new BigInt(x.length);
  let borrow = 0;

  for (let i = 0; i < result.length; i++) {
    let diff = (x[i] || 0) - (y[i] || 0) - borrow;
    borrow = 0;

    if (diff < 0) {
      diff += 256;
      borrow = 1;
    }

    result[i] = diff;
  }

  return result;
}

export function times(x: BigInt, y: BigInt): BigInt {
  const result = new BigInt(x.length + y.length);
  const len = result.length;

  for (let i = 0; i < x.length; i++) {
    let carry = 0;

    for (let j = 0; j < y.length || carry; j++) {
      const product =
        (result[i + j] || 0) + (x[i] || 0) * (y[j] || 0) + carry;
      result[i + j] = product & 0xff;
      carry = product >> 8;
    }
  }

  return result;
}

export function dividedBy(x: BigInt, y: BigInt): BigInt {
  if (y.length === 0 || (y.length === 1 && y[0] === 0)) {
    throw new Error("Division by zero");
  }

  if (x.length === 0) {
    return new BigInt(0);
  }

  let remainder = new BigInt(x.length);
  let quotient = new BigInt(x.length);

  for (let i = x.length - 1; i >= 0; i--) {
    remainder = leftShift(remainder, 8);
    remainder[0] = x[i];
    let k = 0;

    while (compare(remainder, y) >= 0) {
      remainder = minus(remainder, y);
      k++;
    }

    quotient[i] = k;
  }

  return quotient;
}

// export function dividedByDecimal(x: BigInt, y: BigDecimal): BigDecimal {
//   const numerator = x.toBigDecimal();
//   return numerator.div(y);
// }

export function mod(x: BigInt, y: BigInt): BigInt {
  if (y.length === 0 || (y.length === 1 && y[0] === 0)) {
    throw new Error("Division by zero");
  }

  if (x.length === 0) {
    return new BigInt(0);
  }

  let remainder = new BigInt(x.length);

  for (let i = x.length - 1; i >= 0; i--) {
    remainder = leftShift(remainder, 8);
    remainder[0] = x[i];
    let k = 0;

    while (compare(remainder, y) >= 0) {
      remainder = minus(remainder, y);
      k++;
    }
  }

  return remainder;
}

export function pow(x: BigInt, exp: u8): BigInt {
  if (exp === 0) {
    return new BigInt(1);
  }

  let result = new BigInt(x.length);
  result[0] = 1;

  while (exp > 0) {
    if ((exp & 1) === 1) {
      result = times(result, x);
    }

    x = times(x, x);
    exp >>= 1;
  }

  return result;
}

export function fromString(s: string): BigInt {
  const isNegative = s.charAt(0) === "-";
  let startIndex = isNegative ? 1 : 0;

  // Remove leading zeros
  const chars = s.split('');
  while (chars[startIndex] === "0") {
    startIndex++;
  }

  const length = Math.ceil((chars.length - startIndex) / 2);
  const byteArray = new BigInt(length);

  let byteIndex = length - 1;
  let strIndex = chars.length - 2;

  while (strIndex >= startIndex) {
    const hexByte = chars[strIndex] + chars[strIndex + 1];
    byteArray[byteIndex] = parseInt(hexByte, 16);
    byteIndex--;
    strIndex -= 2;
  }

  if (isNegative) {
    byteArray[byteIndex] = 0xff;
  }

  return byteArray;
}

export function bitOr(x: BigInt, y: BigInt): BigInt {
  const result = new BigInt(x.length > y.length ? x.length : y.length);

  for (let i = 0; i < result.length; i++) {
    result[i] = (x[i] || 0) | (y[i] || 0);
  }

  return result;
}

export function bitAnd(x: BigInt, y: BigInt): BigInt {
  const result = new BigInt(x.length > y.length ? x.length : y.length);

  for (let i = 0; i < result.length; i++) {
    result[i] = (x[i] || 0) & (y[i] || 0);
  }

  return result;
}

export function leftShift(x: BigInt, bits: u8): BigInt {
  const byteShift = bits >> 3;
  const bitShift = bits & 0x07;
  const result = new BigInt(x.length + byteShift + 1);

  let carry = 0;

  for (let i = 0; i < x.length; i++) {
    const value = (x[i] || 0) << bitShift | carry;
    result[i + byteShift] = value & 0xff;
    carry = value >> 8;
  }

  if (carry) {
    result[result.length - 1] = carry;
  }

  return result;
}

export function rightShift(x: BigInt, bits: u8): BigInt {
  const byteShift = bits >> 3;
  const bitShift = bits & 0x07;
  const result = new BigInt(x.length - byteShift);

  let carry = 0;

  for (let i = x.length - 1; i >= byteShift; i--) {
    const value = (x[i] || 0) >> bitShift | carry;
    result[i - byteShift] = value & 0xff;
    carry = (x[i] || 0) << (8 - bitShift);
  }

  return result;
}

export function compare(a: BigInt, b: BigInt): i32 {
  const aIsNeg = a.length > 0 && a[a.length - 1] >> 7 == 1;
  const bIsNeg = b.length > 0 && b[b.length - 1] >> 7 == 1;

  if (!aIsNeg && bIsNeg) {
    return 1;
  }

  if (aIsNeg && !bIsNeg) {
    return -1;
  }

  let aRelevantBytes = a.length;

  while (
    aRelevantBytes > 0 &&
    ((!aIsNeg && a[aRelevantBytes - 1] == 0) || (aIsNeg && a[aRelevantBytes - 1] == 255))
  ) {
    aRelevantBytes -= 1;
  }

  let bRelevantBytes = b.length;

  while (
    bRelevantBytes > 0 &&
    ((!bIsNeg && b[bRelevantBytes - 1] == 0) || (bIsNeg && b[bRelevantBytes - 1] == 255))
  ) {
    bRelevantBytes -= 1;
  }

  if (aRelevantBytes > bRelevantBytes) {
    return aIsNeg ? -1 : 1;
  }

  if (bRelevantBytes > aRelevantBytes) {
    return aIsNeg ? 1 : -1;
  }

  const relevantBytes = aRelevantBytes;

  for (let i = 1; i <= relevantBytes; i++) {
    if (a[relevantBytes - i] < b[relevantBytes - i]) {
      return -1;
    }

    if (a[relevantBytes - i] > b[relevantBytes - i]) {
      return 1;
    }
  }

  return 0;
}
