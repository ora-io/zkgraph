// usage: node prove.js [--inputgen/test] <blocknum/blockhash> <state> -> wasm input
// TODO: add -o --outfile <file> under inputgen mode
import { program } from "commander";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { config } from "../config.js";
import { writeFileSync } from "fs";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import { loadJsonRpcProviderUrl, validateProvider } from "./common/utils.js";
import { providers } from "ethers";

program.version("1.0.0");

program
  .argument("<block id>", "Block number (or block hash) as runtime context")
  .argument("<expected state>", "State output of the zkgraph execution")
  .option("-i, --inputgen", "Run in input generation Mode")
  .option("-t, --test", "Run in test Mode")
  .option("-p, --prove", "Run in prove Mode");

program.parse(process.argv);

const args = program.args;
const options = program.opts();

if (!(options.inputgen || options.test || options.prove)) {
  console.error("error: missing running mode (-i / -t / -p)\n");
  program.help();
}

// Log script name
switch (options.inputgen || options.test || options.prove) {
  // Input generation mode
  case options.inputgen === true:
    console.log(">> PROVE: INPUT GENERATION MODE", "\n");
    break;

  // Test mode
  case options.test === true:
    console.log(">> PROVE: PRETEST MODE", "\n");
    break;

  // Prove generation mode (prove-local will not have this option)
  case options.prove === true:
    console.log(">> PROVE: PROVE MODE", "\n");
    break;
}

// Set wasm path & isLocal
let wasmPath;
let isLocal;
if (currentNpmScriptName() === "prove-local") {
  wasmPath = config.LocalWasmBinPath;
  isLocal = true;
} else if (currentNpmScriptName() === "prove") {
  wasmPath = config.WasmBinPath;
  isLocal = false;
}

// Read block id
// const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573
const blockid = parseInt(args[0]); //17633573
let expectedStateStr = args[1];
// expectedStateStr = trimPrefix(expectedStateStr, "0x");

let enableLog = true;

const JsonRpcProviderUrl = loadJsonRpcProviderUrl("src/zkgraph.yaml", true);
const provider = new providers.JsonRpcProvider(JsonRpcProviderUrl);
await validateProvider(provider);

let rawReceiptList = await zkgapi.getRawReceipts(provider, blockid, false);
const simpleblock = await provider.getBlock(blockid).catch(() => {
  console.log("[-] ERROR: Failed to getBlock()", "\n");
  process.exit(1);
});
const block = await zkgapi
  .getBlockByNumber(provider, simpleblock.number)
  .catch(() => {
    console.log("[-] ERROR: Failed to getBlockByNumber()", "\n");
    process.exit(1);
  });
const blockNumber = parseInt(block.number);
const blockHash = block.hash;
const receiptsRoot = block.receiptsRoot;

let [privateInputStr, publicInputStr] = await zkgapi.proveInputGenOnRawReceipts(
  "src/zkgraph.yaml",
  rawReceiptList,
  blockNumber,
  blockHash,
  receiptsRoot,
  expectedStateStr,
  isLocal,
  enableLog,
);

switch (options.inputgen || options.test || options.prove) {
  // Input generation mode
  case options.inputgen === true:
    console.log("[+] ZKGRAPH STATE OUTPUT:", expectedStateStr, "\n");
    console.log("[+] PRIVATE INPUT FOR ZKWASM:", "\n" + privateInputStr, "\n");
    console.log("[+] PUBLIC INPUT FOR ZKWASM:", "\n" + publicInputStr, "\n");
    break;

  // Test mode
  case options.test === true:
    let basePath = import.meta.url + "/../../";

    let mock_succ = await zkgapi.proveMock(
      basePath,
      wasmPath,
      privateInputStr,
      publicInputStr,
    );

    if (mock_succ) {
      console.log("[+] ZKWASM MOCK EXECUTION SUCCESS!", "\n");
    } else {
      console.log("[-] ZKWASM MOCK EXECUTION FAILED", "\n");
    }
    break;

  // Prove mode
  case options.prove === true:
    let result = await zkgapi.prove(
      wasmPath,
      privateInputStr,
      publicInputStr,
      config.ZkwasmProviderUrl,
      config.UserPrivateKey,
      enableLog,
    );

    if (
      result.instances === null &&
      result.batch_instances === null &&
      result.proof === null &&
      result.aux === null
    ) {
      process.exit(1);
    }

    // write proof to file as txt
    let outputProofFile = `build/proof_${result.taskId}.txt`;

    if (enableLog) {
      console.log(`[+] Proof written to ${outputProofFile}.\n`);
    }
    writeFileSync(
      outputProofFile,
      "Instances:\n" +
        result.instances +
        "\n\nBatched Instances:\n" +
        result.batch_instances +
        "\n\nProof transcripts:\n" +
        result.proof +
        "\n\nAux data:\n" +
        result.aux +
        "\n",
    );
    break;
}

logDivider();

process.exit(0);
