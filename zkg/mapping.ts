import { Test2 } from "../sdk/lib/asBigInt.ts";
export function handleEvent(
  esig: Uint8Array,
  topic1: Uint8Array,
  topic2: Uint8Array,
  topic3: Uint8Array,
  data: Uint8Array
): Uint8Array {
    Test2.hello();
  return new Uint8Array(32);
}
