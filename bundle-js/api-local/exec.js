import { asmain } from "../common/bundle_local.js";
import { providers } from "ethers";
import { getRawReceipts } from "../common/ethers_helper.js";
import { fromHexString, toHexString } from "../common/utils.js";
import {
  rlpDecodeAndEventFilter,
  genStreamAndMatchedEventOffsets,
} from "../common/api_helper.js";
import { loadConfig } from "../common/config.js";
import { program } from "commander";
// usage: node exec.js -b <blocknum/blockhash>
// TODO: update handler func name by yaml config

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
console.log("[*] source contract address:", source_address);
console.log("[*] source events signatures:", source_esigs);

const provider = new providers.JsonRpcProvider(
  "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",
);

// Fetch raw receipts
const rawreceiptList = await getRawReceipts(provider, blockid);

// RLP Decode and Filter
const eventList = rlpDecodeAndEventFilter(
  rawreceiptList,
  fromHexString(source_address),
  source_esigs.map((esig) => fromHexString(esig)),
);

// Gen Offsets
let [rawReceipts, matchedEventOffsets] = genStreamAndMatchedEventOffsets(
  rawreceiptList,
  eventList,
);
matchedEventOffsets = Uint32Array.from(matchedEventOffsets);

// Log
console.log(
  "[*] fetched",
  rawreceiptList.length,
  "receipts, from block",
  blockid,
);
console.log("[*] matched", matchedEventOffsets.length / 7, "events");
for (let i in eventList) {
  for (let j in eventList[i]) {
    eventList[i][j].prettyPrint("    Tx[" + i + "]Ev[" + j + "]", false);
  }
}

// Execute zkgraph that would call mapping.ts
const state = asmain(rawReceipts, matchedEventOffsets);

console.log("[+] zkgraph state output:", toHexString(state));
