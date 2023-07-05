export function fromHexString(hexString) {
  hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  hexString = hexString.length % 2 ? "0" + hexString : hexString;
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

export const toHexString = (bytes) => Buffer.from(bytes).toString("hex");

export const areEqualArrays = (first, second) =>
  first.length === second.length &&
  first.every((value, index) => value === second[index]);
