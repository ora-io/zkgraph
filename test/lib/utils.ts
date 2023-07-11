import { ByteArray, Address, Bytes, BigInt } from "../../lib/common/type";

export function testUtils(): void {
  // ByteArray Utils Test
  let byteArray = ByteArray.fromHexString("0x69");

  assert(byteArray.toHex() == "0x69", "ByteArray.toHex()");

  assert(byteArray.toHexString() == "0x69", "ByteArray.toHexString()");

  assert(byteArray.toBase58() == "2p", "ByteArray.toBase58()");

  // Address Utils Test
  let addressFromString = Address.fromString(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  );
  let addressFromBytes = Address.fromBytes(
    Bytes.fromHexString("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"),
  );

  assert(addressFromString == addressFromBytes, "Address.fromString()");

  // BigInt Utils Test
  let bigInt = BigInt.fromString("1234567890");

  assert(bigInt.toString() == "1234567890", "BigInt.toString()");

  assert(bigInt.toHex() == "499602d2", "BigInt.toHex()");

  assert(bigInt.toHexString() == "499602d2", "BigInt.toHexString()");

  assert(bigInt.toHexString("0x") == "0x499602d2", "BigInt.toHexString()");

  console.log("✅ Test Utils");
}
