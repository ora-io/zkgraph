//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event, BigInt, ByteArray } from "../lib/common/type";

export function handleEvents(events: Event[]): Bytes {
  return Bytes.fromHexString("Hello zkGraph!");
}
