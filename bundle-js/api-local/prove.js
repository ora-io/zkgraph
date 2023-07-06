// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
import  { program } from "commander";
import { formatVarLenInput, genStreamAndMatchedEventOffsets } from "../common/apihelper.js";
import { loadConfig } from "../common/config.js";
import { providers } from "ethers";
import { getRawReceipts } from "../common/ethers_helper.js";
import { rlpDecodeAndEventFilter } from "../common/apihelper.js";
import { fromHexString, toHexString } from "../common/utils.js";
import { asmain } from "../common/bundle_local.js";

console.log('test')
program.version("1.0.0");

program.requiredOption("-b, --block <blockid>", "Block number (or block hash) as runtime context")
    .option("-i, --inputgen", "Generate input")
    .option('-p, --pretest', 'Run in pretest Mode');
  
program.parse(process.argv);

const options = program.opts();

// Read block id
var blockid = 0; //17633573
if (options.block) {
    blockid = Number.isFinite(options.block) ? options.block : parseInt(options.block)
//   console.log(`Port number: ${options.port}`);
}

// Load config
var [source_address, source_esigs] = loadConfig('src/zkgraph.yaml')
console.log('[*] source contract address:', source_address)
console.log('[*] source events signatures:', source_esigs)

const provider = new providers.JsonRpcProvider(
    "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
  );

// const block = await provider.getBlock(blockid);
// console.log(block.hash, block.number)

// Fetch raw receipts
var rawreceiptList = await getRawReceipts(provider, blockid);

// RLP Decode and Filter
var eventList = rlpDecodeAndEventFilter(
    rawreceiptList,
    fromHexString(source_address),
    source_esigs.map(esig => fromHexString(esig))
);

// Gen Offsets
var [rawReceipts, matchedEventOffsets] = genStreamAndMatchedEventOffsets(rawreceiptList, eventList)

// Log
console.log('[*] fetched', rawreceiptList.length, 'receipts, from block', blockid)
console.log('[*] matched', matchedEventOffsets.length / 7, 'events')
// console.log('[*] matched', matched_event_offsets.length / 7, 'events, with source_addr = \'' + source_address + '\' source_esigs =', source_esigs)
for (var i in eventList){
    for (var j in eventList[i]){
        eventList[i][j].prettyPrint('    Tx['+i+']Ev['+j+']', false)
    }
}

if (options.inputgen) {
    console.log("Input generation mode");
//   console.log(`Port number: ${options.port}`);
    // Expected State
    const expectedState = asmain(rawReceipts, matchedEventOffsets);

    // Print state and inputs for zkwasm
    console.log("ZKGRAPH OUTPUT:");
    console.log(toHexString(expectedState), "\n");

    // Print inputs for zkwasm
    console.log("PRIVATE INPUT FOR ZKWASM:");
    console.log(
      formatVarLenInput([
        toHexString(rawReceipts),
        toHexString(new Uint8Array(matchedEventOffsets.buffer)),
      ]),
      "\n"
    );

    console.log("PUBLIC INPUT FOR ZKWASM:");
    console.log(formatVarLenInput([toHexString(expectedState)]), "\n");

}