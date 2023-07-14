// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
// TODO: add -o --outfile <file> under inputgen mode
import { program } from "commander";
import {
  formatVarLenInput,
  formatIntInput,
  formatHexStringInput,
  genStreamAndMatchedEventOffsets,
} from "../common/api_helper.js";
import { loadConfig } from "../common/config.js";
import { ethers, providers } from "ethers";
import { getRawReceipts, getBlockByNumber } from "../common/ethers_helper.js";
import { rlpDecodeAndEventFilter } from "../common/api_helper.js";
import {
  fromHexString,
  toHexString,
  trimPrefix,
  logDivider,
} from "../common/utils.js";
import { zkmain, setupZKWasmMock } from "../common/bundle_full.js";
import { ZKWASMMock } from "../common/zkwasm_mock.js";
import { config } from "../../config.js";

program.version("1.0.0");

program
  .argument("<block id>", "Block number (or block hash) as runtime context")
  .argument("<expected state>", "State output of the zkgraph execution")
  .option("-i, --inputgen", "Generate input")
  .option("-p, --pretest", "Run in pretest Mode");

program.parse(process.argv);

const args = program.args;
const options = program.opts();

// Log mode name first
switch (options.inputgen || options.pretest) {
  // Input generation mode
  case options.inputgen:
    // Log script name
    console.log(">> PROVE: INPUT GENERATION MODE", "\n");
    break;

  // Pretest mode
  case options.pretest:
    // Log script name
    console.log(">> PROVE: PRETEST MODE", "\n");
    break;
}

// Read block id
const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573
let expectedStateStr = args[1];
expectedStateStr = trimPrefix(expectedStateStr, "0x");

// Load config
const [source_address, source_esigs] = loadConfig("src/zkgraph.yaml");

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

// Get block
const simpleblock = await provider.getBlock(blockid);
const block = await getBlockByNumber(provider, simpleblock.number)
// console.log(block.hash, block.number)
// console.log(block)

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

const publicInputStr =
    formatIntInput(parseInt(block.number)) +
    formatHexStringInput(block.hash) +
    formatVarLenInput(expectedStateStr)

const privateInputStr =
    formatVarLenInput(toHexString(rawReceipts)) +
    formatHexStringInput(block.receiptsRoot)

// Log content based on mode
switch (options.inputgen || options.pretest) {
  // Input generation mode
  case options.inputgen:
    console.log("[+] ZKGRAPH STATE OUTPUT:", expectedStateStr, "\n");
    console.log("[+] PRIVATE INPUT FOR ZKWASM:", "\n" + privateInputStr, "\n");
    console.log("[+] PUBLIC INPUT FOR ZKWASM:", "\n" + publicInputStr, "\n");
    break;

  // Pretest mode
  case options.pretest:
    const mock = new ZKWASMMock();
    mock.set_private_input(privateInputStr);
    mock.set_public_input(publicInputStr);
    setupZKWasmMock(mock);
    zkmain();
    console.log("[+] ZKWASM MOCK EXECUTION SUCCESS!", "\n");
    break;
}

logDivider();

process.exit(0);
