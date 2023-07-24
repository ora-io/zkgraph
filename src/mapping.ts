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

  let r0_ = BigInt.fromBytesBigEndian(reserve0);
  console.log("actual  :" + r0_.toHexString());
  let r0 = BigInt.fromString(reserve0.toHexString(), 16);
  console.log("expected:" + r0.toHexString());

  let a = new Uint32Array(5);
  a[0] = 0xf0000000;
  a[1] = 0xf0000000;
  a[2] = 0xf0000000;
  a[3] = 0xf0000000;
  a[4] = 0xf0000000;
  let b = Uint8Array.wrap(a.buffer);
  let c = BigInt.fromBytes(b);
  console.log("c:" + c.toString(16));
  let d = BigInt.fromString(c.toString(16), 16);
  console.log("d:" + d.toString(16));
  console.log(c == d ? "TRUE" : "FALSE");

  // let r1 = BigInt.fromString(reserve1.toHexString(), 16);
  // let bi_price = r1.div(r0)

  // require(bi_price.ge(BigInt.fromString('466ba8760e97fb2')) == true ? 1 : 0);

  // let payload = Bytes.fromHexString(bi_price.toString(16)).paddingTo(32, true, 0)
  return reserve0;
}

function applyDigitMask(bytes: Uint32Array): Uint32Array {
  // Get first half bytes
  const firstHalfBytes = [];
  for (let i = 0; i < bytes.length; i++) {
    firstHalfBytes.push(bytes[i] >> 28);
    console.log(firstHalfBytes[i].toString(16));
  }
  for (let i = 0; i < bytes.length - 1; i++) {
    if (firstHalfBytes[i] != 0) {
      bytes[i] = bytes[i] & ((1 << 28) - 1);
      bytes[i + 1] = (bytes[i + 1] << 4) | firstHalfBytes[i];
    }
  }
  // if firstHalfBytes' last element is not 0, then add a new element to bytes
  if (firstHalfBytes[firstHalfBytes.length - 1] == 0) {
    return bytes;
  } else {
    const newBytes = new Uint32Array(bytes.length + 1);
    newBytes.set(bytes)
    newBytes[bytes.length] = firstHalfBytes[firstHalfBytes.length - 1];
    return newBytes;
  }
}
