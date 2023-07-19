//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event, BigInt } from "../lib/common/type";
// @ts-ignore
@external("env", "js_log")
export declare function js_log(x: i32): void

export function handleEvents(events: Event[]): Bytes {
  const source = changetype<Bytes>(events[0].data);
  let reserve0 = source.slice(30, 32);
  let reserve1 = source.slice(32, 64);

  let r0 = BigInt.fromString(reserve0.toHexString(), 16);
  let r1 = BigInt.fromString(reserve1.toHexString(), 16);
  let bi_price = r1.div(r0)

  require(bi_price.ge(BigInt.fromString('466ba8760e97fb2')) == true ? 1 : 0);

  let payload = Bytes.fromHexString(bi_price.toString(16)).paddingTo(32, true, 0)
  return payload;
}
