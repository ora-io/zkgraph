import { testBytesFromUTF8, testBytesWithByteArray } from "./bytes";
import { testBigInt } from "./bigInt";
import { testBigIntMath } from "./bigIntMath";
import { testUtils } from "./utils";

export function test(): void {
  testBytesFromUTF8();
  testBytesWithByteArray();
  testBigInt();
  testBigIntMath();
  testUtils();
}
