import { asmain } from "./entries";
import { receiveMatchedEvents } from "./receive";

function inner(
  raw_receipts_ptr: usize,
  match_event_cnt: i32,
  matched_event_offsets_ptr: usize,
): usize {
  var state = receiveMatchedEvents(
    raw_receipts_ptr,
    match_event_cnt,
    matched_event_offsets_ptr,
  );
  return state.dataStart;
}

export { asmain, inner };
