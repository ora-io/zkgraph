//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event, BigInt, ByteArray } from "../lib/common/type";
// // @ts-ignore
// @external("env", "js_log")
// export declare function js_log(x: i32): void
export function handleEvents(events: Event[]): Bytes {
  return Bytes.fromHexString("Hello zkGraph!");
}
