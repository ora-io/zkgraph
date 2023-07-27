import { ByteArray, Address, Bytes } from "../../lib/common/type";
import { uint8ArrayToUint32Array } from "../../lib/utils/conversion";

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

  // uint8ArrayToUint32Array Test
  let uint8Array = new Uint8Array(4);
  uint8Array[0] = 0x12;
  uint8Array[1] = 0x34;
  uint8Array[2] = 0x56;
  uint8Array[3] = 0x78;
  let uint32Array = uint8ArrayToUint32Array(uint8Array);
  assert(uint32Array.length == 2, "uint8ArrayToUint32Array()");
  assert(uint32Array[0] == 0x8563412, "uint8ArrayToUint32Array()");
  assert(uint32Array[1] == 0x7, "uint8ArrayToUint32Array()");

  console.log("✅ Test Utils");
}
