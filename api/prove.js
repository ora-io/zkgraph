// usage: node prove.js [--inputgen/test] <blocknum/blockhash> <state> -> wasm input
// TODO: add -o --outfile <file> under inputgen mode
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import inquirer from "inquirer";
import { ZkWasmUtil } from "zkWasm-service-helper";
import { fileURLToPath } from "url";
import { program } from "commander";
import { TdABI, TdConfig } from "./common/constants.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { config } from "../config.js";
import { writeFileSync } from "fs";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import {
  loadJsonRpcProviderUrl,
  validateProvider,
  queryTaskId,
} from "./common/utils.js";
import { providers } from "ethers";
import { waitProve } from "@hyperoracle/zkgraph-api";

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

const dirname = path.dirname(fileURLToPath(import.meta.url));
const wasm = fs.readFileSync(path.join(dirname, "../", wasmPath));
const wasmUnit8Array = new Uint8Array(wasm);
const yamlContent = fs.readFileSync(
  path.join(dirname, "../src/zkgraph.yaml"),
  "utf8",
);

let [privateInputStr, publicInputStr] = await zkgapi.proveInputGenOnRawReceipts(
  yamlContent,
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
      wasmUnit8Array,
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
    let fee = "0.005";
    const feeInWei = ethers.utils.parseEther(fee);

    const questions = [
      {
        type: "confirm",
        name: "confirmation",
        message: `You are going to publish a Prove request to the Sepolia testnet, which would require ${fee} SepoliaETH. Proceed?`,
        default: true,
      },
    ];

    inquirer.prompt(questions).then((answers) => {
      if (!answers.confirmation) {
        console.log("Task canceled.");
        process.exit(0);
      }
    });
    const provider = new ethers.providers.JsonRpcProvider(TdConfig.providerUrl);
    const signer = new ethers.Wallet(config.UserPrivateKey, provider);

    let dispatcherContract = new ethers.Contract(
      TdConfig.contract,
      TdABI,
      provider,
    ).connect(signer);

    const md5 = ZkWasmUtil.convertToMd5(wasmUnit8Array).toUpperCase();
    const tx = await dispatcherContract.prove(
      md5,
      privateInputStr,
      publicInputStr,
      {
        value: feeInWei,
      },
    );

    const txhash = tx.hash;
    console.log(
      `[+] Prove Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
    );

    await tx.wait();

    console.log("[+] Transaction Confirmed. Creating Prove Task");

    const taskId = await queryTaskId(txhash);
    if (!taskId) {
      console.log("[+] DEPLOY TASK FAILED. \n");
      process.exit(1);
    }
    console.log(`[+] PROVE TASK STARTED. TASK ID: ${taskId}`, "\n");

    const result = await waitProve(config.ZkwasmProviderUrl, taskId, true);

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
