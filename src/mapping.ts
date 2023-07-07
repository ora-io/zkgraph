//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event } from "../lib/common/type";

export function handleEvents(events: Event[]): Bytes {
  //   var source = changetype<Bytes>(events[1].data);
  //   let reserve0 = source.slice(31, 32);
  //   let reserve1 = source.slice(63, 64);
  //   require(...);
  //   let state = new Bytes(32);
  //   state[31] = reserve0.toU32() + reserve1.toU32();
  //   state = source.slice(50)
  //   console.log(events[0].address.toHexString())
  //   console.log(events[0].esig.toHexString())
  let state = new Bytes(0);
  if (events.length > 0) {
    state = events[0].address;
  }
  require(state.length == 20 ? 1 : 0);
  return state;
}
