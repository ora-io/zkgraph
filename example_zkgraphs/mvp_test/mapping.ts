import { Bytes } from "../../lib/common/type";
export function handleEvent(
  esig: Uint8Array,
  topic1: Uint8Array,
  topic2: Uint8Array,
  topic3: Uint8Array,
  data: Uint8Array
): Uint8Array {
  return Bytes.fromU64(Bytes.fromU64(0x1234).toU64());
}
