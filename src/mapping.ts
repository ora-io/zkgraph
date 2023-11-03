
// import { Bytes, Event } from "@hyperoracle/zkgraph-lib";

export function handleEvents(events: Event[]): Bytes {
  let state = new Bytes(0);
  if (events.length > 0) {
    state = events[0].address;
  }
  require(state.length == 20);
  return state;
}
//@ts-ignore
import { BigInt, require } from "@hyperoracle/zkgraph-lib";
//@ts-ignore
// import { Event, Slot, Account, Block } from "../node_modules/@hyperoracle/zkgraph-lib";
import { Bytes, Event, Slot, Account, Block } from "~lib/@hyperoracle/zkgraph-lib";

let addr = '0xa60ecf32309539dd84f27a9563754dca818b815e';
// let esig = Bytes.fromHexString('0x1012');
let key = Bytes.fromHexString('0x0000000000000000000000000000000000000000000000000000000000000008');
// let key = 8;

export function handleBlocks(blocks: Block[]): Bytes{
    // console.log('here0')
    // let acct = blocks[0].account(Bytes.fromHexString(addr));
    // console.log('here1 ' + acct.hasSlotByBytes(key).toString())
    console.log(BigInt.fromBytes( blocks[0].account(Bytes.fromHexString(addr)).storage(key)).toHexString());
    return blocks[0].account(Bytes.fromHexString(addr)).storage(key);
    // return blocks[0].account(Bytes.fromHexString(addr)).storageByBytes(key);
    // console.log(blocks[1].account(addr).events[0].esig.toString());
    // blocks.get(-1).account(addr).storage.get(key);
}
