import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import inquirer from "inquirer";
import { ZkWasmUtil } from "zkWasm-service-helper";
import { fileURLToPath } from "url";
import { program } from "commander";
import { config } from "../config.js";
import { getTargetNetwork, queryTaskId } from "./common/utils.js";
import { TdABI, TdConfig } from "./common/constants.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { loadZKGraphDestinations } from "./common/config_utils.js";
import { waitDeploy } from "@hyperoracle/zkgraph-api";

program.version("1.0.0");

program.option(
  "-n, --network-name <name>",
  "Name of deployed network for verification contract",
);

program.parse(process.argv);

const args = program.args;
const options = program.opts();

// Log script name
console.log(">> DEPLOY VERIFICATION CONTRACT", "\n");

let targetNetwork;
// Set default network name
if (options.networkName === undefined) {
  const inputtedNetworkName =
    loadZKGraphDestinations("src/zkgraph.yaml")[0].network;
  targetNetwork = getTargetNetwork(inputtedNetworkName);
} else {
  targetNetwork = getTargetNetwork(options.networkName);
}

// Get wasm path
let wasmPath;
if (currentNpmScriptName() === "deploy-local") {
  wasmPath = config.LocalWasmBinPath;
} else if (currentNpmScriptName() === "deploy") {
  wasmPath = config.WasmBinPath;
}
const dirname = path.dirname(fileURLToPath(import.meta.url));
const wasm = fs.readFileSync(path.join(dirname, "../", wasmPath));
const wasmUnit8Array = new Uint8Array(wasm);
const md5 = ZkWasmUtil.convertToMd5(wasmUnit8Array).toUpperCase();

console.log(`[*] IMAGE MD5: ${md5}`, "\n");

let fee = "0.005";
const feeInWei = ethers.utils.parseEther(fee);

const questions = [
  {
    type: "confirm",
    name: "confirmation",
    message: `You are going to publish a Deploy request to the Sepolia testnet, which would require ${fee} SepoliaETH. Proceed?`,
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

const tx = await dispatcherContract.deploy(md5, targetNetwork.value, {
  value: feeInWei,
});

let txhash = tx.hash;
console.log(
  `[+] Deploy Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
);

await tx.wait();

console.log("[+] Transaction Confirmed. Creating Deploy Task");

const taskId = await queryTaskId(txhash);
if (!taskId) {
  console.log("[+] DEPLOY TASK FAILED. \n");
  process.exit(1);
}
console.log(`[+] DEPLOY TASK STARTED. TASK ID: ${taskId}`, "\n");

const deployedVerificationContractAddress = await waitDeploy(
  config.ZkwasmProviderUrl,
  taskId,
  md5,
  targetNetwork.value,
  true,
);

logDivider();

if (deployedVerificationContractAddress === "") {
  process.exit(1);
} else {
  process.exit(0);
}
