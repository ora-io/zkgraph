import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { ZkWasmUtil } from "zkWasm-service-helper";
import { fileURLToPath } from "url";
import { program } from "commander";
import { config } from "../config.js";
import { getTargetNetwork, queryTaskId } from "./common/utils.js";
import { TdABI } from "./common/constants.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { loadZKGraphDestinations } from "./common/config_utils.js";
import { waitDeploy } from "@hyperoracle/zkgraph-api";

program.version("1.0.0");

program.option(
  "-n, --network-name <name>",
  "Name of deployed network for verification contract"
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

const feeInWei = ethers.utils.parseEther("0.005");
const provider = new ethers.providers.JsonRpcProvider(
  config.DispatcherProviderUrl
);
const signer = new ethers.Wallet(config.UserPrivateKey, provider);

let dispatcherContract = new ethers.Contract(
  config.DispatcherContract,
  TdABI,
  provider
).connect(signer);

const tx = await dispatcherContract.deploy(md5, targetNetwork.value, {
  value: feeInWei,
});

await tx.wait();

let txhash = tx.hash;
const taskId = await queryTaskId(txhash);
if (!taskId) {
  console.log("[+] DEPLOY TASK FAILED. \n");
  process.exit(1);
}
console.log(`[+] DEPLOY TASK STARTED. TXHASH: ${txhash}, TASK ID: ${taskId}`, "\n");

const deployedVerificationContractAddress = await waitDeploy(
  config.ZkwasmProviderUrl,
  taskId,
  md5,
  targetNetwork.value,
  true
);

logDivider();

if (deployedVerificationContractAddress === "") {
  process.exit(1);
} else {
  process.exit(0);
}
