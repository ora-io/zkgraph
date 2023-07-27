import {
  testBytesAddedFunctions,
  testBytesFromUTF8,
  testBytesWithByteArray,
} from "./bytes";
import { testUtils } from "./utils";
import { testBigInt } from "./bigInt";

export function test(): void {
  testBytesFromUTF8();
  testBytesWithByteArray();
  testBytesAddedFunctions();
  testBigInt();
  testUtils();
}
