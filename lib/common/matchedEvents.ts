import { handleEvents } from "mapping";
import { Event, Bytes, PtrDeref } from "./type";
// TODO: test this
export function receiveMatchedEvents(
    raw_receipt_ptr: usize, 
    match_event_cnt:i32, 
    matched_event_offset_list_ptr: usize
): Uint8Array {
    
    var events = new Array<Event>();
    const topicLength = 32;
    for (var i=0; i < match_event_cnt; i++){
        const event_base_ptr = matched_event_offset_list_ptr + i * 28;
        // c_log(lastLogStart)
        const esig = Bytes.fromRawarrPtr(raw_receipt_ptr + PtrDeref.read(event_base_ptr+1*4), topicLength);

        const topic1Offset = PtrDeref.read(event_base_ptr+2*4)
        const topic1 = topic1Offset == 0 ? new Bytes(0): Bytes.fromRawarrPtr(raw_receipt_ptr + topic1Offset, topicLength);

        const topic2Offset = PtrDeref.read(event_base_ptr+2*4)
        const topic2 = topic2Offset == 0 ? new Bytes(0): Bytes.fromRawarrPtr(raw_receipt_ptr + topic2Offset, topicLength);
        
        const topic3Offset = PtrDeref.read(event_base_ptr+2*4)
        const topic3 = topic3Offset == 0 ? new Bytes(0): Bytes.fromRawarrPtr(raw_receipt_ptr + topic3Offset, topicLength);

        const data = Bytes.fromRawarrPtr(raw_receipt_ptr + PtrDeref.read(event_base_ptr+5*4), PtrDeref.read(event_base_ptr+6*4) as i32);
        events.push(new Event(esig as Uint8Array, topic1 as Uint8Array, topic2 as Uint8Array, topic3 as Uint8Array, data as Uint8Array));
    }
    
    var state = handleEvents(events);
    return state;
}