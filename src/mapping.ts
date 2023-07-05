import { Bytes, Event } from "../lib/common/type";
import { require } from "../lib/common/zkwasm";

//TODO: events[]
export function handleEvents(events: Event[]): Bytes {
  //   var source = changetype<Bytes>(events[1].data);
  //   let reserve0 = source.slice(31, 32);
  //   let reserve1 = source.slice(63, 64);
  //   require(...);
  //   let state = new Bytes(32);
  //   state[31] = reserve0.toU32() + reserve1.toU32();
  //   state = source.slice(50)
  let state = events[1].address;
  require(true);
  return state;
}
