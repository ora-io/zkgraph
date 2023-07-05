import { receiveMatchedEvents } from "./common/receive";
import { Bytes } from "./common/type";
import {
  read_public_len_then_bytes,
  read_private_len_then_bytes,
  require,
} from "./common/zkwasm";

// @ts-ignore
// @external("env", "require")
// export declare function require(x: i32): void

export function asmain(
  rawreceipts: Uint8Array,
  matched_event_offsets: Uint32Array
): Uint8Array {
  var state = receiveMatchedEvents(
    rawreceipts.dataStart,
    matched_event_offsets.length / 7,
    matched_event_offsets.dataStart
  );
  return state;
}

export function zkmain(): void {
  var rawreceipts: Bytes = read_private_len_then_bytes();
  var _offsets = read_private_len_then_bytes();
  var matched_event_offset = changetype<Uint32Array>(_offsets);
  var expected_state = read_public_len_then_bytes();
  //   console.log("test3 "+expected_state.toHexString());
  var state: Bytes = receiveMatchedEvents(
    rawreceipts.dataStart,
    matched_event_offset.length / 7,
    matched_event_offset.dataStart
  ) as Bytes;

  require(state == expected_state);
}
/**
 * passed prove task:
 * 0x0000000000000000000000000000000000000000000000000000000000001234:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x40:i64 0x00000000000000000000000000000000000000000014df54140456547ac7f6570000000000000000000000000000000000000000000000040f915afbed20232c:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000001:bytes-packed
 *  */
