// Implementation for
// (https://github.com/graphprotocol/graph-tooling/blob/main/packages/ts/common/conversion.ts)
// For The Graph, they appear to be implemented in the node
// (https://github.com/graphprotocol/graph-node/blob/39094b1144b37f6614ca070c02ace2a0fd321391/runtime/wasm/src/module/mod.rs)
// Need optimization for zkWASM
// For this implementation, we use the `as-bigint` lib by Polywrap
// (https://github.com/polywrap/as-bigint)
import { BigInt, ByteArray } from "../common/type";
// TODO: Remove third-party dependency
import { BigInt as ASBigInt } from "../extlib/asBigInt";

export function bytesToString(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    let byte = bytes[i].toString(16).padStart(2, "0");
    hex += byte;
  }
  return "0x" + hex;
}

export function bigIntToString(bigInt: Uint8Array): string {
  return bigIntToASBigInt(changetype<BigInt>(bigInt)).toString();
}

export function bigIntToHex(bigInt: Uint8Array): string {
  return bigIntToASBigInt(changetype<BigInt>(bigInt)).toString(16);
}

export function stringToH160(s: string): Uint8Array {
  assert(s.length == 40 || s.length == 42, "address has wrong length");
  return ByteArray.fromHexString(s);
}

// For this implementation, we are referring to the `as-base58` lib by near
// (https://github.com/near/as-base58)
export function bytesToBase58(n: Uint8Array): string {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const BASE = 58;
  const LEADER = ALPHABET.charAt(0);
  const FACTOR_NUM = 406;
  const FACTOR_DEN = 554;

  const INV_FACTOR_NUM = FACTOR_DEN;
  const INV_FACTOR_DEN = FACTOR_NUM - 1;

  // Skip & count leading zeroes.
  let pend = n.length;
  let pbegin = 0;
  while (pbegin != pend && n[pbegin] == 0) ++pbegin;
  let zeroes = pbegin;

  // Allocate enough space in big-endian base58 representation.
  let size = ((pend - pbegin) * INV_FACTOR_NUM) / INV_FACTOR_DEN + 1;
  let b58 = new Uint8Array(size);
  let length = 0;

  // Process the bytes.
  while (pbegin != pend) {
    let carry = u32(n[pbegin]);
    // Apply "b58 = b58 * 256 + ch".
    let i = 0;
    for (let it = size - 1; it != -1 && (carry != 0 || i < length); --it, ++i) {
      carry += u32(b58[it]) << 8;
      b58[it] = carry % BASE;
      carry = carry / BASE;
    }
    if (ASC_OPTIMIZE_LEVEL == 0) {
      assert(!carry, "Non-zero carry");
    }
    length = i;
    pbegin++;
  }

  // Skip leading zeroes in base58 result.
  let it = size - length;
  while (it != size && b58[it] == 0) ++it;

  // Translate the result into a string.
  let str = LEADER.repeat(zeroes);
  for (; it < size; ++it) str += ALPHABET.charAt(b58[it]);
  return str;
}

/**
 * Helper function to convert a BigInt to an ASBigInt for using `as-bigint` lib.
 */
export function bigIntToASBigInt(bigInt: BigInt): ASBigInt {
  return ASBigInt.fromInt64(bigInt.toI64());
}
