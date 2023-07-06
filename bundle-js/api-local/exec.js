import { asmain } from "../common/bundle_local.js";
// import { asmain } from "../build/demo_idx.js";

import { providers, utils } from "ethers";
import { getRawReceipts } from "../common/ethers_helper.js";
import { fromHexString, toHexString } from "../common/utils.js";
import { rlpDecodeAndEventFilter, genStreamAndMatchedEventOffsets } from "../common/apihelper.js";
import { loadConfig } from "../common/config.js";
import  { program } from "commander";
// usage: node exec.js -b <blocknum/blockhash>
//TODO: update handler func name by yaml config

// Parse args
program.version("1.0.0");
program.requiredOption("-b, --block <blockid>", "Block number (or block hash) as runtime context")
program.parse(process.argv);
const options = program.opts();

var blockid = 0; //17633573
if (options.block) {
    blockid = Number.isFinite(options.block) ? options.block : parseInt(options.block)
//   console.log(`Port number: ${options.port}`);
}

// Load config
var [source_address, source_esigs] = loadConfig('src/zkgraph.yaml')
console.log('[*] source contract address:', source_address)
console.log('[*] source events signatures:', source_esigs)

// var source_address = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
// var source_esigs = ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"]

// const provider = new providers.JsonRpcProvider("https://eth.llamarpc.com");
const provider = new providers.JsonRpcProvider(
    "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
  );

// const block = await provider.getBlock(blockid);
// console.log(block.hash, block.number)

// Fetch raw receipts
var rawreceiptList = await getRawReceipts(provider, blockid);
// var rawreceiptList = rawreceiptList.slice(20, 26)

// RLP Decode and Filter
var eventList = rlpDecodeAndEventFilter(
    rawreceiptList,
    fromHexString(source_address),
    source_esigs.map(esig => fromHexString(esig))
);

// Gen Offsets
var [rawReceipts, matchedEventOffsets] = genStreamAndMatchedEventOffsets(rawreceiptList, eventList)
matchedEventOffsets = Uint32Array.from(matchedEventOffsets)

// Log
console.log('[*] fetched', rawreceiptList.length, 'receipts, from block', blockid)
console.log('[*] matched', matchedEventOffsets.length / 7, 'events')
// console.log('[*] matched', matched_event_offsets.length / 7, 'events, with source_addr = \'' + source_address + '\' source_esigs =', source_esigs)
for (var i in eventList){
    for (var j in eventList[i]){
        eventList[i][j].prettyPrint('    Tx['+i+']Ev['+j+']', false)
    }
}

// Execute zkgraph that would call mapping.ts
var state = asmain(rawReceipts, matchedEventOffsets);

console.log("[+] zkgraph state output:", toHexString(state));