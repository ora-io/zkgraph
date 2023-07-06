// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
//TODO: add -o --outfile <file> under inputgen mode
import { program } from "commander";
import {
  formatVarLenInput,
  genStreamAndMatchedEventOffsets,
} from "../common/api_helper.js";
import { loadConfig } from "../common/config.js";
import { providers } from "ethers";
import { getRawReceipts } from "../common/ethers_helper.js";
import { rlpDecodeAndEventFilter } from "../common/api_helper.js";
import { fromHexString, toHexString, trimPrefix } from "../common/utils.js";
import { zkmain, setupZKWasmMock } from "../common/bundle_local.js";

program.version("1.0.0");

program
  .argument("<block id>", "Block number (or block hash) as runtime context")
  .argument("<expected state>", "State output of the zkgraph execution")
  .option("-i, --inputgen", "Generate input")
  .option("-p, --pretest", "Run in pretest Mode");

program.parse(process.argv);

const args = program.args;
const options = program.opts();

// Read block id
const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573
let expectedStateStr = args[1];
expectedStateStr = trimPrefix(expectedStateStr, "0x");

// Load config
const [source_address, source_esigs] = loadConfig("src/zkgraph.yaml");
console.log("[*] source contract address:", source_address);
console.log("[*] source events signatures:", source_esigs);

const provider = new providers.JsonRpcProvider(
  "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",
);

// Fetch raw receipts
let rawreceiptList = await getRawReceipts(provider, blockid);
rawreceiptList = rawreceiptList.slice(25, 26);

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

const privateInputStr = formatVarLenInput([
  toHexString(rawReceipts),
  toHexString(new Uint8Array(matchedEventOffsets.buffer)),
]);

const publicInputStr = formatVarLenInput([expectedStateStr]);

if (options.inputgen) {
  console.log("Input generation mode");

  console.log("ZKGRAPH STATE OUTPUT:");
  console.log(expectedStateStr, "\n");

  console.log("PRIVATE INPUT FOR ZKWASM:");
  console.log(privateInputStr, "\n");

  console.log("PUBLIC INPUT FOR ZKWASM:");
  console.log(publicInputStr, "\n");
  process.exit(0);
}

import { ZKWASMMock } from "../common/zkwasm_mock.js";

if (options.pretest) {
  const mock = new ZKWASMMock();

  mock.set_private_input(privateInputStr);
  mock.set_public_input(publicInputStr);

  setupZKWasmMock(mock);

  zkmain();

  console.log("[+] zkwasm mock execution success");
}
