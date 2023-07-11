import { handleEvents } from "../../src/mapping";
import { Event, Bytes, PtrDeref } from "./type";

/**
 *
 * @param raw_receipts_ptr
 * @param match_event_cnt
 * @param matched_event_offsets_ptr int Uint32Array format, note that each item is read as little endian to align with PtrDeref.read and remain minimum wasmbin size
 * @returns
 */
export function receiveMatchedEvents(
  raw_receipts_ptr: usize,
  match_event_cnt: i32,
  matched_event_offsets_ptr: usize,
): Uint8Array {
  var events = new Array<Event>(0);
  const addressLength = 20;
  const topicLength = 32;

  for (var i = 0; i < match_event_cnt; i++) {
    const event_base_ptr = matched_event_offsets_ptr + i * 28;

    const address = Bytes.fromRawarrPtr(
      raw_receipts_ptr + PtrDeref.read(event_base_ptr),
      addressLength,
    );
    const esig = Bytes.fromRawarrPtr(
      raw_receipts_ptr + PtrDeref.read(event_base_ptr + 1 * 4),
      topicLength,
    );

    const topic1Offset = PtrDeref.read(event_base_ptr + 2 * 4);
    const topic1 =
      topic1Offset == 0
        ? new Bytes(0)
        : Bytes.fromRawarrPtr(raw_receipts_ptr + topic1Offset, topicLength);

    const topic2Offset = PtrDeref.read(event_base_ptr + 2 * 4);
    const topic2 =
      topic2Offset == 0
        ? new Bytes(0)
        : Bytes.fromRawarrPtr(raw_receipts_ptr + topic2Offset, topicLength);

    const topic3Offset = PtrDeref.read(event_base_ptr + 2 * 4);
    const topic3 =
      topic3Offset == 0
        ? new Bytes(0)
        : Bytes.fromRawarrPtr(raw_receipts_ptr + topic3Offset, topicLength);

    const data = Bytes.fromRawarrPtr(
      raw_receipts_ptr + PtrDeref.read(event_base_ptr + 5 * 4),
      PtrDeref.read(event_base_ptr + 6 * 4) as i32,
    );
    events.push(new Event(address, esig, topic1, topic2, topic3, data));
  }

  var state = handleEvents(events);
  return state as Uint8Array;
}
