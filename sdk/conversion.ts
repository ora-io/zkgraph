// Implementation for
// (https://github.com/graphprotocol/graph-tooling/blob/main/packages/ts/common/conversion.ts)
// For The Graph, they appear to be implemented in the node
// (https://github.com/graphprotocol/graph-node/blob/39094b1144b37f6614ca070c02ace2a0fd321391/runtime/wasm/src/module/mod.rs)
// Need optimization for zkWASM
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
  return bytesToString(bigInt);
}

export function bigIntToHex(bigInt: Uint8Array): string {
  return bytesToHex(bigInt);
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
