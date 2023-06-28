import { handleEvents } from "mapping";
import { PtrDeref } from "./common/type";
import { receiveMatchedEvents } from "./common/matchedevents";

// used in asc to rm env.abort
function abort(a:usize, b:usize, c:u32, d:u32):void{}
// @ts-ignore
// @external("env", "require")
// export declare function require(x: i32): void


export function asmain(
    rawreceipts: Uint8Array,
    matched_event_offset: Uint32Array, 
): Uint8Array {
    var state = receiveMatchedEvents(rawreceipts.dataStart, matched_event_offset.length / 7, matched_event_offset.dataStart);
    return state;
}

