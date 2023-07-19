import { asmain } from "./entries";
import { receiveMatchedEvents } from "./receive";

import { js_log } from "../../src/mapping";
function inner(
    raw_receipts_ptr: usize,
    match_event_cnt: i32,
    matched_event_offsets_ptr: usize,
  ): usize {
    var a = "0xabcdef"
  js_log(1234000)
  js_log(a.length)
  js_log(__heap_base)
  js_log(__data_end)
  js_log(__stack_pointer)
    var state = receiveMatchedEvents(raw_receipts_ptr, match_event_cnt, matched_event_offsets_ptr);
    return state.dataStart
}

export { asmain, inner };
