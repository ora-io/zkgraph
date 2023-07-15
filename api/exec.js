// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
// TODO: add -o --outfile <file> under inputgen mode
import { program } from "commander";
import { genStreamAndMatchedEventOffsets } from "./common/api_helper.js";
import { loadZKGraphConfig } from "./common/config_utils.js";
import { providers } from "ethers";
import { getRawReceipts } from "./common/ethers_helper.js";
import { rlpDecodeAndEventFilter } from "./common/api_helper.js";
import {
  fromHexString,
  toHexString,
  logDivider,
  currentNpmScriptName,
  logReceiptAndEvents
} from "./common/utils.js";
import { config } from "../config.js";
import { instantiateWasm } from "./common/bundle.js";

program.version("1.0.0");

program.argument(
  "<block id>",
  "Block number (or block hash) as runtime context"
);
program.parse(process.argv);
const args = program.args;

const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573

// Load config
const [source_address, source_esigs] = loadZKGraphConfig("src/zkgraph.yaml");

console.log("[*] Source contract address:", source_address);
console.log("[*] Source events signatures:", source_esigs, "\n");

const provider = new providers.JsonRpcProvider(config.JsonRpcProviderUrl);

// Fetch raw receipts
const rawreceiptList = await getRawReceipts(provider, blockid);

// RLP Decode and Filter
const [filteredRawReceiptList, filteredEventList] = rlpDecodeAndEventFilter(
  rawreceiptList,
  fromHexString(source_address),
  source_esigs.map((esig) => fromHexString(esig))
);

// Gen Offsets
let [rawReceipts, matchedEventOffsets] = genStreamAndMatchedEventOffsets(
  filteredRawReceiptList,
  filteredEventList
);

// Log
logReceiptAndEvents(rawreceiptList, blockid, matchedEventOffsets, filteredEventList);

// may remove
matchedEventOffsets = Uint32Array.from(matchedEventOffsets);

// Declare Wasm Binary Path
let wasmPath;

if (currentNpmScriptName() === "exec-local") {
    wasmPath = config.LocalWasmBinPath
} else if (currentNpmScriptName() === "exec") {
    wasmPath = config.WasmBinPath
}

const { asmain } = await instantiateWasm(wasmPath)

// Execute zkgraph that would call mapping.ts
let state = asmain(rawReceipts, matchedEventOffsets);

console.log("[+] ZKGRAPH STATE OUTPUT:", toHexString(state), "\n");

logDivider();

process.exit(0);
