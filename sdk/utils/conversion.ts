// Implementation for
// (https://github.com/graphprotocol/graph-tooling/blob/main/packages/ts/common/conversion.ts)
// For The Graph, they appear to be implemented in the node
// (https://github.com/graphprotocol/graph-node/blob/39094b1144b37f6614ca070c02ace2a0fd321391/runtime/wasm/src/module/mod.rs)
// Need optimization for zkWASM
// For this implementation, we use the `as-bigint` lib by Polywrap
// (https://github.com/polywrap/as-bigint)
import { BigInt } from "../type";
// TODO: Remove third-party dependency
import { BigInt as ASBigInt } from "../lib/asBigInt";

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
  return "0x" + bigIntToASBigInt(changetype<BigInt>(bigInt)).toString();
}

export function stringToH160(s: string): Uint8Array {
  const bytes = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    bytes[i] = s.charCodeAt(i);
  }
  return bytes;
}

export function bytesToBase58(n: Uint8Array): string {
  // Implementation for converting bytes to Base58
  // ...
  return ""; // Placeholder, replace with actual implementation
}

/**
 * Helper function to convert a BigInt to an ASBigInt for using `as-bigint` lib.
 */
export function bigIntToASBigInt(bigInt: BigInt): ASBigInt {
  return ASBigInt.fromInt64(bigInt.toI64());
}
