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
  let uint8Array = new ByteArray(1);
  uint8Array[0] = 105;
  let uint32Array = uint8ArrayToUint32Array(uint8Array);
  assert(uint32Array.length == 1, "uint8ArrayToUint32Array()");
  assert(uint32Array[0] == 105, "uint8ArrayToUint32Array()");
  uint8Array = new ByteArray(4);
  uint8Array[0] = 2;
  uint8Array[1] = 0;
  uint8Array[2] = 0;
  uint8Array[3] = 9;
  uint32Array = uint8ArrayToUint32Array(uint8Array);
  assert(uint32Array.length == 1, "uint8ArrayToUint32Array()");
  assert(uint32Array[0] == 150994946, "uint8ArrayToUint32Array()");

  console.log("✅ Test Utils");
}
