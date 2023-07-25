//@ts-ignore
import { require } from "../lib/common/zkwasm";
import { Bytes, Event, BigInt, ByteArray } from "../lib/common/type";
// @ts-ignore
@external("env", "js_log")
export declare function js_log(x: i32): void

export function handleEvents(events: Event[]): Bytes {
  // const source = changetype<Bytes>(events[0].data);
  // let reserve0 = Bytes.fromU8Array(source.slice(0, 32));
  // // let reserve1 = source.slice(32, 64);

  // let r0_ = BigInt.fromBytesBigEndian(reserve0);
  // console.log("actual  :" + r0_.toHexString());
  // let r0 = BigInt.fromString(reserve0.toHexString(), 16);
  // console.log("expected:" + r0.toHexString());

//   let a = new Uint32Array(5);
//   a[0] = 0x12345678;
//   a[1] = 0x90abcdef;
//   a[2] = 0x12345678;
//   a[3] = 0x09abcdef;
//   a[4] = 0x12345678;
  let a_str = "0x1234567890abcdef"
  let a: Uint8Array = changetype<Uint8Array>(ByteArray.fromHexString(a_str))
//   let b = Uint8Array.wrap(a.buffer);
  let c = BigInt.fromBytes(a);
  console.log("c:" + c.toString(16));
  let d = BigInt.fromString(a_str, 16);
  console.log("d:" + d.toString(16));
  let e = BigInt.fromBytesBigEndian(a);
  console.log("e:" + e.toString(16));
  let f = BigInt.fromString("efcdab9078563412", 16);
  console.log("f:" + f.toString(16));
  console.log(c == d ? "TRUE" : "FALSE");

  // let r1 = BigInt.fromString(reserve1.toHexString(), 16);
  // let bi_price = r1.div(r0)

  // require(bi_price.ge(BigInt.fromString('466ba8760e97fb2')) == true ? 1 : 0);

  // let payload = Bytes.fromHexString(bi_price.toString(16)).paddingTo(32, true, 0)
  return events[0].data;
}
