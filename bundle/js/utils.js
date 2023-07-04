export const fromHexString = (hexString) =>
  hexString.startsWith("0x")
    ? Uint8Array.from(Buffer.from(hexString.slice(2), "hex"))
    : Uint8Array.from(Buffer.from(hexString, "hex"));

export const toHexString = (bytes) => Buffer.from(bytes).toString("hex");

export const areEqualArrays = (first, second) =>
  first.length === second.length &&
  first.every((value, index) => value === second[index]);
