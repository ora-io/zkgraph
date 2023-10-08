//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Event, BigInt, ByteArray } from "@hyperoracle/zkgraph-lib";

export function handleEvents(events: Event[]): Bytes {
  // run() - keccak256 c0406226a44c49a673ef01611ce55e97850e1c520ac5d22c6854eb2dbaee7040
  let tmp = Bytes.fromHexString(
    "c0406226a44c49a673ef01611ce55e97850e1c520ac5d22c6854eb2dbaee7040",
  );
  return Bytes.fromHexString("c0406226").padEnd(32);
}
