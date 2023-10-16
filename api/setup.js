import path from "path";
import { ethers } from "ethers";
import { fileURLToPath } from "url";
import { config } from "../config.js";
import { queryTaskId, uoloadWasmToTd } from "./common/utils.js";
import { TdABI } from "./common/constants.js";
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
const tx = await dispatcherContract.setup(md5, cirSz, {
  value: feeInWei,
});

await tx.wait();

const txhash = tx.hash;
const taskId = await queryTaskId(txhash);
if (!taskId) {
  console.log("[+] DEPLOY TASK FAILED. \n");
  process.exit(1);
}
console.log(
  `[+] SETUP TASK STARTED. TXHASH: ${txhash}, TASK ID: ${taskId}`,
  "\n"
);

const result = await waitSetup(config.ZkwasmProviderUrl, taskId, true);

logDivider();

process.exit(0);
