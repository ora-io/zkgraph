import { Address, ByteArray, Bytes } from "../type";

export function testAddress(): void {
  let address0 = Address.zero();
  assert(address0.length == 20, "address length should be 20");
  console.log("✅ Test Address Length");

  let address1 = Address.fromString("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  let address2 = Address.zero();
  assert(address1 != address2, "address1 should not be equal to address2");
  console.log("✅ Test Address Equal Operator");
}

export function testByteArray(): void {
  let byteArray = ByteArray.fromI32(123);
  assert(byteArray.length == 4, "byteArray length should be 4");
  console.log("✅ Test ByteArray Length");
}
