// usage: node prove.js [--inputgen/test] <blocknum/blockhash> <state> -> wasm input
// TODO: add -o --outfile <file> under inputgen mode
import { program } from "commander";
import {
  formatVarLenInput,
  formatIntInput,
  formatHexStringInput,
  genStreamAndMatchedEventOffsets,
} from "./common/api_helper.js";
import { loadZKGraphConfig } from "./common/config_utils.js";
import { providers } from "ethers";
import { getRawReceipts, getBlockByNumber } from "./common/ethers_helper.js";
import { rlpDecodeAndEventFilter } from "./common/api_helper.js";
import {
  fromHexString,
  toHexString,
  trimPrefix,
  logDivider,
  currentNpmScriptName,
  logReceiptAndEvents,
} from "./common/utils.js";
import { ZKWASMMock } from "./common/zkwasm_mock.js";
import { config } from "../config.js";
import { zkwasm_prove } from "./requests/zkwasm_prove.js";
import { readFileSync } from "fs";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { waitTaskStatus } from "./requests/zkwasm_taskdetails.js";
import { instantiateWasm, setupZKWasmMock } from "./common/bundle.js";

program.version("1.0.0");

program
  .argument("<block id>", "Block number (or block hash) as runtime context")
  .argument("<expected state>", "State output of the zkgraph execution")
  .option("-i, --inputgen", "Generate input")
  .option("-t, --test", "Run in test Mode");

// If it's prove with full mode, add --prove option
if (currentNpmScriptName() === "prove") {
  program.option("-p, --prove", "Run in prove Mode");
}

program.parse(process.argv);

const args = program.args;
const options = program.opts();

switch (options.inputgen || options.test || options.prove) {
  // Input generation mode
  case options.inputgen === true:
    // Log script name
    console.log(">> PROVE: INPUT GENERATION MODE", "\n");
    break;

  // Test mode
  case options.test === true:
    // Log script name
    console.log(">> PROVE: PRETEST MODE", "\n");
    break;

  // Prove generation mode (prove-local will not have this option)
  case options.prove === true:
    // Log script name
    console.log(">> PROVE: PROVE MODE", "\n");
    break;
}

// Read block id
const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573
let expectedStateStr = args[1];
expectedStateStr = trimPrefix(expectedStateStr, "0x");

// Load config
const [source_address, source_esigs] = loadZKGraphConfig("src/zkgraph.yaml");

const provider = new providers.JsonRpcProvider(config.JsonRpcProviderUrl);

// Fetch raw receipts
let rawreceiptList = await getRawReceipts(provider, blockid);

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

// Log receipt number from block, and filtered events
logReceiptAndEvents(
    rawreceiptList,
    blockid,
    matchedEventOffsets,
    filteredEventList
);

// may remove
matchedEventOffsets = Uint32Array.from(matchedEventOffsets);

// Declare inputs
let privateInputStr, publicInputStr;
let wasmPath;

// Set value for inputs
if (currentNpmScriptName() === "prove-local") {
  wasmPath = config.LocalWasmBinPath

  // Generate inputs
  privateInputStr =
    formatVarLenInput(toHexString(rawReceipts)) +
    formatVarLenInput(toHexString(new Uint8Array(matchedEventOffsets.buffer)));
  publicInputStr = formatVarLenInput(expectedStateStr);

} else if (currentNpmScriptName() === "prove") {
  wasmPath = config.WasmBinPath

  // Get block
  const simpleblock = await provider.getBlock(blockid).catch(() => {
    console.log("[-] ERROR: Failed to getBlock()", "\n");
    process.exit(1);
  });
  const block = await getBlockByNumber(provider, simpleblock.number).catch(
    () => {
      console.log("[-] ERROR: Failed to getBlockByNumber()", "\n");
      process.exit(1);
    }
  );

  // Generate inputs
  publicInputStr =
    formatIntInput(parseInt(block.number)) +
    formatHexStringInput(block.hash) +
    formatVarLenInput(expectedStateStr);
  privateInputStr =
    formatVarLenInput(toHexString(rawReceipts)) +
    formatHexStringInput(block.receiptsRoot);

  // Prove mode
  if (options.prove === true) {
    const compiledWasmBuffer = readFileSync(wasmPath);
    const privateInputArray = privateInputStr.trim().split(" ");
    const publicInputArray = publicInputStr.trim().split(" ");

    // Message and form data
    const md5 = ZkWasmUtil.convertToMd5(compiledWasmBuffer).toUpperCase();
    const prikey = config.UserPrivateKey;

    let [response, isSetUpSuccess, errorMessage] = await zkwasm_prove(
      prikey,
      md5,
      publicInputArray,
      privateInputArray
    );

    if (isSetUpSuccess) {
      console.log(`[+] IMAGE MD5: ${response.data.result.md5}`, "\n");

      console.log(
        `[+] PROVE TASK STARTED. TASK ID: ${response.data.result.id}`,
        "\n"
      );

      console.log(
        "[*] Please wait for proof generation... (estimated: 1-5 min)",
        "\n"
      );

      const taskResult = await waitTaskStatus(
        response.data.result.id,
        ["Done", "Fail"],
        2000,
        0
      ); //TODO: timeout

      const taskStatus = taskResult === "Done" ? "SUCCESS" : "FAILED";

      console.log(
        `[${taskStatus === "SUCCESS" ? "+" : "-"}] PROVE ${taskStatus}`,
        "\n"
      );
    } else {
      console.log(`[*] IMAGE MD5: ${md5}`, "\n");
      // Log status
      console.log(`[-] ${errorMessage}`, "\n");
    }
  }
}

switch (options.inputgen || options.test) {
  // Input generation mode
  case options.inputgen === true:
    console.log("[+] ZKGRAPH STATE OUTPUT:", expectedStateStr, "\n");
    console.log("[+] PRIVATE INPUT FOR ZKWASM:", "\n" + privateInputStr, "\n");
    console.log("[+] PUBLIC INPUT FOR ZKWASM:", "\n" + publicInputStr, "\n");
    break;

  // Test mode
  case options.test === true:
    const mock = new ZKWASMMock();
    mock.set_private_input(privateInputStr);
    mock.set_public_input(publicInputStr);
    setupZKWasmMock(mock);
    const {zkmain} = await instantiateWasm(wasmPath);
    zkmain();
    console.log("[+] ZKWASM MOCK EXECUTION SUCCESS!", "\n");
    break;
}

logDivider();

process.exit(0);
