//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event, BigInt } from "../lib/common/type";
// @ts-ignore
@external("env", "js_log")
export declare function js_log(x: i32): void

export function handleEvents(events: Event[]): Bytes {
  const source = changetype<Bytes>(events[0].data);
  let reserve0 = source.slice(0, 32);
  // let reserve1 = source.slice(32, 64);

  // log each byte of reserve0
  let log = "";
  for (let i = reserve0.length - 1; i >= 0; i--) {
    log += reserve0[i].toString();
    log += " ";
  }
  console.log("mapping input    8: " + log);
  let r0_ = BigInt.fromBytesBigEndian(reserve0);
  console.log("actual  :" + r0_.toHexString());
  let r0 = BigInt.fromString(reserve0.toHexString(), 16);
  console.log("expected:" + r0.toHexString());


  // let r1 = BigInt.fromString(reserve1.toHexString(), 16);
  // let bi_price = r1.div(r0)

  // require(bi_price.ge(BigInt.fromString('466ba8760e97fb2')) == true ? 1 : 0);

  // let payload = Bytes.fromHexString(bi_price.toString(16)).paddingTo(32, true, 0)
  return reserve0;
}
