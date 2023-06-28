// WIP

import { Bytes } from "./common/type";
import { handleEvents } from "mapping";

// used in asc to rm env.abort
function abort(a:usize, b:usize, c:u32, d:u32):void{}

// @ts-ignore
@external("env", "wasm_input")
declare function wasm_input(x: i32): i64

// @ts-ignore
@external("env", "require")
export declare function require(x: i32): void

export function wasm_private_input(): i64
{
  return wasm_input(0);
}

export function wasm_public_input(): i64
{
  return wasm_input(1);
}

export function read_bytes_from_u64_to_dst(dst: Bytes, byte_length: i32): Bytes {
    var dst64 = changetype<Uint64Array>(dst);
    for (var i:i32 = 0; i * 8 < byte_length; i++)
    {
        if (i * 8 + 8 < byte_length)
        {
            dst64[i] = wasm_public_input();
        }
        else
        {
            // less then 8 bytes on demand
            var u64_cache = wasm_public_input();
            var u8_cache: i64 = u64_cache;
            for (var j:i32 = i * 8; j < byte_length; j++)
            {
                let u8_t =  u8_cache as u8;
                dst[j] = u8_t;
                u8_cache = u8_cache >> 8
            }
        }
    }
    return dst;
}

export function read_bytes_from_u64(byte_length: i32): Bytes {
    var dst = new Bytes(byte_length);
    read_bytes_from_u64_to_dst(dst, byte_length);
    return dst;
}

export function read_len_then_bytes(): Bytes {
    var blen = wasm_public_input() as i32;
    var bytes = read_bytes_from_u64(blen);
    return bytes;
}


export function zkmain(): void {
  var esig = read_bytes_from_u64(32);
  var topic1 = read_bytes_from_u64(32);
  var topic2 = read_bytes_from_u64(32);
  var topic3 = read_bytes_from_u64(32);
  var data = read_len_then_bytes();

  var expected_output = read_bytes_from_u64(32);

//   var output = handleEvents(
//     esig as Uint8Array,
//     topic1 as Uint8Array,
//     topic2 as Uint8Array,
//     topic3 as Uint8Array,
//     data as Uint8Array
//   ) as Bytes;

//   require(output == expected_output);
}
/**
 * passed prove task:
 * 0x0000000000000000000000000000000000000000000000000000000000001234:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000000:bytes-packed 0x40:i64 0x00000000000000000000000000000000000000000014df54140456547ac7f6570000000000000000000000000000000000000000000000040f915afbed20232c:bytes-packed 0x0000000000000000000000000000000000000000000000000000000000000001:bytes-packed
 *  */
