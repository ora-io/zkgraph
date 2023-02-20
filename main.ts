import { wasm_public_input, wasm_private_input, require, read_bytes_from_u64, read_len_then_bytes } from "./sdk/zkwasm";
import { Bytes } from "./sdk/type";
import { handleEvent } from "mapping";

export function zkmain():void{
    // var blen = wasm_public_input() as i32;
    var esig = read_bytes_from_u64(32);

    // ...
    // var data = read_len_then_bytes()

    // var idx = wasm_public_input() as i32;
    // var val = wasm_public_input() as u8;

    var expected_output = read_bytes_from_u64(32);
    
    var output = handleEvent(esig as Uint8Array) as Bytes;

    require(output == expected_output);
}
// passed prove task: 0x04:i64 0x12345678:bytes-packed 0x00:i64 0x12:i64
// passed prove task: 0x0a:i64 0x123456780a0b0c0d0e0f:bytes-packed 0x08:i64 0x0e:i64