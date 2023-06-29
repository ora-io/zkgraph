import { receiveMatchedEvents } from "./common/receive";

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

