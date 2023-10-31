
//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
//@ts-ignore
import { Bytes } from "../node_modules/@hyperoracle/zkgraph-lib";
//@ts-ignore
import { Event, Slot, Account, Block } from "../node_modules/@hyperoracle/zkgraph-lib";
// import { Bytes, Event, Slot, Account, Block } from "@hyperoracle/zkgraph-lib";

// export function handleEvents(events: Event[]): Bytes {
//     console.log('in handleEvents '+events.length.toString())
//   let state = new Bytes(0);
//   if (events.length > 0) {
//     state = events[0].address;
//   }
//   console.log('in handleEvents 2')
// //   require(state.length == 20);
  
//   console.log('in handleEvents 3')
//   return state;
// }


let addr = '0xa60ecf32309539dd84f27a9563754dca818b815e';
// let esig = Bytes.fromHexString('0x1012');
let key = Bytes.fromHexString('0x0000000000000000000000000000000000000000000000000000000000000008');
// let key = 8;

export function handleBlocks(blocks: Block[]): Bytes{
    // console.log('here0')
    // let acct = blocks[0].account(Bytes.fromHexString(addr));
    // console.log('here1 ' + acct.hasSlotByBytes(key).toString())
    return blocks[0].account(Bytes.fromHexString(addr)).storage(key);
    // return blocks[0].account(Bytes.fromHexString(addr)).storageByBytes(key);
    // console.log(blocks[1].account(addr).events[0].esig.toString());
    // blocks.get(-1).account(addr).storage.get(key);
}
