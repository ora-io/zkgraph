import { program } from "commander";
import { config } from "../config.js";
import { getAbsolutePath, getTargetNetwork, getWasmUint8Array } from "./common/utils.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { loadZKGraphDestinations } from "./common/config_utils.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";

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

const wasmUnit8Array = getWasmUint8Array(getAbsolutePath('../' + wasmPath));
const deployedVerificationContractAddress = await zkgapi.deploy(
  wasmUnit8Array,
  targetNetwork.value,
  config.ZkwasmProviderUrl,
  config.UserPrivateKey,
  true,
);

logDivider();

if (deployedVerificationContractAddress === "") {
  process.exit(1);
} else {
  process.exit(0);
}
