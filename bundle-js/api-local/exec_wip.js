import { asmain } from "../common/bundle_local.js";
// import { asmain } from "../build/demo_idx.js";

import { providers, utils } from "ethers";
import { getRawReceipts } from "../common/ethers_helper.js";
import { TxReceipt, concatRawRlpList } from "../common/txreceipt.js";
import { fromHexString } from "../common/utils.js";
// usage: node exec.js <blocknum/blockhash>
//TODO: read args from input
//TODO: read blocknum/blockhash from one another
//TODO: read yaml -> source addr/esig
//TODO: block -> rawreceipts -> rlp -> filter -> matched_event_offsets

// const provider = new providers.JsonRpcProvider("https://eth.llamarpc.com");
const provider = new providers.JsonRpcProvider(
  "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
);

// var blockid = '0x03facc885d5200e68c418df7828ee77056065068671ac72ba29dee6ff73ce583'
// var blockid = '0x917a76c491f59c25d95c9568a6ae8262c554c18b5a44c7e0bada276770507a72'
// var blockid = 0x104b758;
// const block = await provider.getBlock(blockid);
// console.log(block.hash, block.number)

// var rawreceipt_list = await getRawReceipts(provider, blockid);
// var rawreceipts = concatRawRlpList(rawreceipt_list);

// console.log(toHexString(rawreceipts))

// console.log(rawreceipt_list[0])
// var tmp = '0x02f901a60182dcd0b9010000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080000000000040000000000000400000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000010000040000000000000000000000000000000000000000000000000000000000000000000040000002000000000000000000000000000000000000100000000000000000080000000000000000000000000000000000000000000000000000000000000000f89df89b946bea7cfef803d1e3d5f7c0103f7ded065644e197f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000feb430ed4c21b748681f7a0b41cb071c603a40e9a000000000000000000000000026805021988f1a45dc708b5fb75fc75f21747d8ca00000000000000000000000000000000000000000000000c6bb68e521f8f14d23'

function eventTo7Offsets(event){
    console.log('---',event.address_offset)
    console.log('---',event)
    var rst = [event.address_offset[0]]
    
    for (var i = 0; i<4; i++){
        rst.push(i < event.topics.length ? event.topics_offset[i][0] : 0)
    }

    rst.push(event.data.length)
    rst.push(event.data_offset[0])
    return rst
}

function rlpDecodeAndFilter(rawreceiptList, srcAddr, srcEsigs) {
  for (var i in rawreceiptList) {
    console.log('t2')
    var es = TxReceipt.fromRawStr(rawreceiptList[i]).filter(srcAddr, srcEsigs);
    console.log('t2')
    console.log(eventTo7Offsets(es[0]))
    // break;
  }
}

var rawreceipt_list = [
    "02f9043a0183046276b9010000200000000000000000000080000000000000000000000000010000000000000000000000000001000000000000000002040000080000000000040000000000000000000000000000000008000000200000080000000000000000008000000004000000000000000000000000000000000000000000000000000010000000000000000000000000004000000000000000000001000000080000004000000000000000004000000000000000020100000000000000000000000000020000000000000002000000080000000000000000000000000000001020000000000020000000200000000080000000000000000000000000000000400000000000000000f9032ff87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a0e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109ca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000000000000000000000000000016345785d8a0000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6a0000000000000000000000000000000000000000000000000016345785d8a0000f89b94d4cfb98837861216f1b51ca7368471c7a3d428abf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6a0000000000000000000000000b4645d3702f52f0a610e1616c5c07b81a085bfffa0000000000000000000000000000000000000000000001e9bf47b130a5af20ff5f87994c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b840000000000000000000000000000000000000000000000000e714ae4d320c454300000000000000000000000000000000000000000013d969429a7b93a3578f60f8fc94c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4645d3702f52f0a610e1616c5c07b81a085bfffb880000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e9bf47b130a5af20ff5"
  ];
rlpDecodeAndFilter(
  rawreceipt_list,
  fromHexString("c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"),
  [
    fromHexString(
      "e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
    ),
  ]
);
// if (rawreceipts[0] == 0x02) {
//   rawreceipts = rawreceipts.slice(1);
// }
// var matched_event_offsets = Uint32Array.from([
//   711, 733, 0, 0, 0, 767, 64, 711, 733, 0, 0, 0, 767, 64,
// ]);
// // console.log(rawreceipts)
// // console.log(matched_event_offset, matched_event_offset.length)
// var state = asmain(rawreceipts, matched_event_offsets);

// console.log("[+] zkgraph output:", toHexString(state));
