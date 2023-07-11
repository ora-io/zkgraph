import { asmain } from "../common/bundle_local.js";
import { providers } from "ethers";
import { getRawReceipts } from "../common/ethers_helper.js";
import { fromHexString, toHexString, logDivider } from "../common/utils.js";
import {
  rlpDecodeAndEventFilter,
  genStreamAndMatchedEventOffsets,
} from "../common/api_helper.js";
import { loadConfig } from "../common/config.js";
import { program } from "commander";
import { config } from "../../config.js";
// usage: node exec.js -b <blocknum/blockhash>
// TODO: update handler func name by yaml config

// Log script name
console.log(">> EXECUTE", "\n");

// Parse args
program.version("1.0.0");
program.argument(
  "<block id>",
  "Block number (or block hash) as runtime context",
);
program.parse(process.argv);
const args = program.args;

const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573

// Load config
const [source_address, source_esigs] = loadConfig("src/zkgraph.yaml");
console.log("[*] Source contract address:", source_address);
console.log("[*] Source events signatures:", source_esigs, "\n");

const provider = new providers.JsonRpcProvider(config.JsonRpcProviderUrl);

// Fetch raw receipts
const rawreceiptList = await getRawReceipts(provider, blockid);

// RLP Decode and Filter
const [filteredRawReceiptList, filteredEventList] = rlpDecodeAndEventFilter(
  rawreceiptList,
  fromHexString(source_address),
  source_esigs.map((esig) => fromHexString(esig)),
);

// Gen Offsets
let [rawReceipts, matchedEventOffsets] = genStreamAndMatchedEventOffsets(
  filteredRawReceiptList,
  filteredEventList,
);
matchedEventOffsets = Uint32Array.from(matchedEventOffsets);

// Log
console.log(
  "[*]",
  rawreceiptList.length,
  rawreceiptList.length > 1
    ? "receipts fetched from block"
    : "receipt fetched from block",
  blockid,
);
console.log(
  "[*]",
  matchedEventOffsets.length / 7,
  matchedEventOffsets.length / 7 > 1 ? "events matched" : "event matched",
);
for (let i in filteredEventList) {
  for (let j in filteredEventList[i]) {
    filteredEventList[i][j].prettyPrint("\tTx[" + i + "]Event[" + j + "]", false);
  }
}

// Execute zkgraph that would call mapping.ts
const state = asmain(rawReceipts, matchedEventOffsets);

console.log("[+] ZKGRAPH STATE OUTPUT:", toHexString(state), "\n");

logDivider();
