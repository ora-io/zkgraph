//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event, BigInt } from "../lib/common/type";

export function handleEvents(events: Event[]): Bytes {
  let state = new Bytes(0);
  if (events.length > 0) {
    state = events[0].address;
  }
  require(state.length == 20);
  return state;
}
