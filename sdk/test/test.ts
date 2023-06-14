import { testBytesFromUTF8, testBytesWithByteArray } from "./bytes";
import { testBigInt } from "./bigInt";

export function test(): void {
  testBytesFromUTF8();
  testBytesWithByteArray();
  testBigInt();
}
