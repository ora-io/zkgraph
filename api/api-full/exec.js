// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
// TODO: add -o --outfile <file> under inputgen mode
import { program } from "commander";
import {
  genStreamAndMatchedEventOffsets,
} from "../common/api_helper.js";
import { loadZKGraphConfig } from "../common/config_utils.js";
import { ethers, providers } from "ethers";
import { getRawReceipts, getBlockByNumber } from "../common/ethers_helper.js";
import { rlpDecodeAndEventFilter } from "../common/api_helper.js";
import {
  fromHexString,
  toHexString,
  trimPrefix,
  logDivider,
} from "../common/utils.js";
import { asmain } from "../common/bundle_full.js";
import { config } from "../../config.js";

program.version("1.0.0");

program.argument(
    "<block id>",
    "Block number (or block hash) as runtime context",
  );
program.parse(process.argv);
const args = program.args;

// Read block id
const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573

// Load config
const [source_address, source_esigs] = loadZKGraphConfig("src/zkgraph.yaml");

const provider = new providers.JsonRpcProvider(config.JsonRpcProviderUrl);

// Fetch raw receipts
let rawreceiptList = await getRawReceipts(provider, blockid);
// rawreceiptList = rawreceiptList.slice(25, 26);

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
      filteredEventList[i][j].prettyPrint(
        "\tTx[" + i + "]Event[" + j + "]",
        false,
      );
    }
  }

// Execute zkgraph that would call mapping.ts
const state = asmain(rawReceipts, matchedEventOffsets);

console.log("[+] ZKGRAPH STATE OUTPUT:", toHexString(state), "\n");

logDivider();

process.exit(0);
