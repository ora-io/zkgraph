import { Bytes, ByteArray } from "../../lib/common/type";

export function testBytesWithByteArray(): void {
  const longArray = new ByteArray(5);
  longArray[0] = 251;
  longArray[1] = 255;
  longArray[2] = 251;
  longArray[3] = 255;
  longArray[4] = 0;
  assert(longArray.toU32() == 4_294_705_147);
  assert(longArray.toI32() == 4_294_705_147);

  const bytes = Bytes.fromHexString("0x56696b746f726961");
  assert((bytes[0] = 0x56));
  assert((bytes[1] = 0x69));
  assert((bytes[2] = 0x6b));
  assert((bytes[3] = 0x74));
  assert((bytes[4] = 0x6f));
  assert((bytes[5] = 0x72));
  assert((bytes[6] = 0x69));
  assert((bytes[7] = 0x61));

  assert(ByteArray.fromI32(1) == ByteArray.fromI32(1));
  assert(ByteArray.fromI32(1) != ByteArray.fromI32(2));
  console.log("✅ Test Bytes with ByteArray");
}

export function testBytesFromUTF8(): void {
  // [123, 32, 34, 104, 101, 108, 108, 111, 34, 58, 32, 34, 119, 111, 114, 108, 100, 34, 32, 125]
  const str = '{ "hello": "world" }';

  const bytes = Bytes.fromUTF8(str);

  for (let i = 0; i < bytes.length; i++) {
    assert(bytes[i] == str.charCodeAt(i));
  }
  console.log("✅ Test Bytes from UTF8");
}

export function testBytesAddedFunctions(): void {
  // Normal slice
  let bytes = Bytes.fromHexString("0x56696b746f726961").slice(0, 4);
  assert(bytes.length == 4, `Bytes length ${bytes.length} is not 4`);
  assert(bytes[0] == 0x56);
  assert(bytes[1] == 0x69);
  assert(bytes[2] == 0x6b);
  assert(bytes[3] == 0x74);
  // Copy slice
  bytes = Bytes.fromHexString("0x56696b746f726961").slice();
  assert(bytes.length == 8, `Bytes length ${bytes.length} is not 8`);
  assert(bytes[0] == 0x56);
  assert(bytes[1] == 0x69);
  assert(bytes[2] == 0x6b);
  assert(bytes[3] == 0x74);
  assert(bytes[4] == 0x6f);
  assert(bytes[5] == 0x72);
  assert(bytes[6] == 0x69);
  assert(bytes[7] == 0x61);
  // Just start index
  bytes = Bytes.fromHexString("0x56696b746f726961").slice(4);
  assert(bytes.length == 4, `Bytes length ${bytes.length} is not 4`);
  assert(bytes[0] == 0x6f);
  assert(bytes[1] == 0x72);
  assert(bytes[2] == 0x69);
  assert(bytes[3] == 0x61);
  // Start > end
  bytes = Bytes.fromHexString("0x56696b746f726961").slice(9, 4);
  assert(bytes.length == 4, `Bytes length ${bytes.length} is not 4`);
  assert(bytes[0] == 0x0);
  assert(bytes[1] == 0x0);
  assert(bytes[2] == 0x0);
  assert(bytes[3] == 0x0);
  // end === -1
  bytes = Bytes.fromHexString("0x56696b746f726961").slice(4, -1);
  assert(bytes.length == 4, `Bytes length ${bytes.length} is not 4`);
  assert(bytes[0] == 0x6f);
  assert(bytes[1] == 0x72);
  assert(bytes[2] == 0x69);
  assert(bytes[3] == 0x61);

  // padStart, padEnd
  bytes = Bytes.fromHexString("0x56696b746f726961").padStart(10, 0x00);
  assert(bytes.length == 10, `Bytes length ${bytes.length} is not 10`);
  assert(bytes[0] == 0x00);
  assert(bytes[1] == 0x00);
  assert(bytes[2] == 0x56);
  bytes = Bytes.fromHexString("0x56696b746f726961").padEnd(10, 0x00);
  assert(bytes.length == 10, `Bytes length ${bytes.length} is not 10`);
  assert(bytes[7] == 0x61);
  assert(bytes[8] == 0x00);
  assert(bytes[9] == 0x00);

  console.log("✅ Test Bytes added functions");
}
