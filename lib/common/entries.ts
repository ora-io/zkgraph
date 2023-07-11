import { receiveMatchedEvents } from "./receive";
import { Bytes } from "./type";
import {
  read_public_len_then_bytes,
  read_private_len_then_bytes,
  // @ts-ignore
  require,
} from "./zkwasm";

export function asmain(
  rawreceipts: Uint8Array,
  matched_event_offsets: Uint32Array,
): Uint8Array {
  const state = receiveMatchedEvents(
    rawreceipts.dataStart,
    matched_event_offsets.length / 7,
    matched_event_offsets.dataStart,
  );
  return state;
}

export function zkmain(): void {
  const rawreceipts: Bytes = read_private_len_then_bytes();
  const _offsets = read_private_len_then_bytes();
  const matched_event_offset = changetype<Uint32Array>(_offsets);
  const expected_state = read_public_len_then_bytes();

  const state: Bytes = receiveMatchedEvents(
    rawreceipts.dataStart,
    matched_event_offset.length / 7,
    matched_event_offset.dataStart,
  ) as Bytes;

  require(state == expected_state ? 1 : 0);
}
