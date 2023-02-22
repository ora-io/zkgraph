import { Bytes } from "../sdk/type";
export function handleEvent(esig: Uint8Array, topic1: Uint8Array, topic2: Uint8Array, topic3: Uint8Array, data: Uint8Array): Uint8Array {
    var source = changetype<Bytes>(data);
    let reserve0 = source.slice(62, 63);
    let reserve1 = source.slice(63, 64);
    
    let state = new Bytes(1);
    state[0] = reserve1.toU32() / reserve0.toU32();;
    return state as Uint8Array;
}