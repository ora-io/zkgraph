import { require, read_bytes_from_u64, read_len_then_bytes } from "./sdk/zkwasm";
import { Bytes } from "./sdk/type";
import { handleEvent } from "mapping";

export function zkmain(): void {
    var esig = read_bytes_from_u64(32);
    var topic1 = read_bytes_from_u64(32);
    var topic2 = read_bytes_from_u64(32);
    var topic3 = read_bytes_from_u64(32);
    var data = read_len_then_bytes()

    var expected_output = read_len_then_bytes();

    var output = handleEvent(esig as Uint8Array, topic1 as Uint8Array, topic2 as Uint8Array, topic3 as Uint8Array, data as Uint8Array) as Bytes;

    require(output == expected_output);
}
/**
 * passed prove task: 
 * 0x0000000000000000000000000000000000000000000000000000000000001234:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x40:i64 0x00000000000000000000000000000000000000000014df54140456547ac7f6570000000000000000000000000000000000000000000000040f915afbed20232c:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000001:bytes-packed
 *  */ 