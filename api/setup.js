import path from "path";
import { ethers } from "ethers";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { config } from "../config.js";
import { queryTaskId, uoloadWasmToTd } from "./common/utils.js";
import { TdABI, TdConfig } from "./common/constants.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { waitSetup, zkwasm_imagedetails } from "@hyperoracle/zkgraph-api";
import { program } from "commander";

program.version("1.0.0");

program.option("-k, --circuit-size <size>", "Circuit size (k in 2^k) of image");

program.parse(process.argv);

const args = program.args;
const options = program.opts();

let wasmPath;
let isLocal;
let cirSz;
if (currentNpmScriptName() === "setup-local") {
  wasmPath = config.LocalWasmBinPath;
  isLocal = true;
  cirSz = 20;
} else if (currentNpmScriptName() === "setup") {
  wasmPath = config.WasmBinPath;
  isLocal = false;
  cirSz = 22;
}

if (options.circuitSize !== undefined) {
  cirSz = parseInt(options.circuitSize);
}

// Log script name
console.log(">> SET UP", "\n");

const dirname = path.dirname(fileURLToPath(import.meta.url));
const wasmFullPath = path.join(dirname, "../", wasmPath);

const md5 = await uoloadWasmToTd(wasmFullPath);
console.log(`[*] IMAGE MD5: ${md5}`, "\n");

let deatails = await zkwasm_imagedetails(config.ZkwasmProviderUrl, md5);
if (deatails[0].data.result[0] !== null) {
  console.log(`[*] IMAGE ALREADY EXISTS`, "\n");
  process.exit(1);
}

let fee = "0.005";
const feeInWei = ethers.utils.parseEther(fee);

const questions = [
  {
    type: "confirm",
    name: "confirmation",
    message: `You are going to publish a Setup request to the Sepolia testnet, which would require ${fee} SepoliaETH. Proceed?`,
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
const tx = await dispatcherContract.setup(md5, cirSz, {
  value: feeInWei,
});

const txhash = tx.hash;
console.log(
  `[+] Setup Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
);

await tx.wait();

console.log("[+] Transaction Confirmed. Creating Setup Task");
const taskId = await queryTaskId(txhash);
if (!taskId) {
  console.log("[+] DEPLOY TASK FAILED. \n");
  process.exit(1);
}
console.log(`[+] SETUP TASK STARTED. TASK ID: ${taskId}`, "\n");

const result = await waitSetup(config.ZkwasmProviderUrl, taskId, true);

logDivider();

process.exit(0);
