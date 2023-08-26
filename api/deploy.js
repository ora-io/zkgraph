import { program } from "commander";
import { config } from "../config.js";
import {
  getTargetNetwork
} from "./common/utils.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { loadZKGraphDestinations } from "./common/config_utils.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";

program.version("1.0.0");
program.argument(
  "[network name]",
  "Name of deployed network for verification contract",
  "sepolia"
);
program.parse(process.argv);
const args = program.args;

// Log script name
console.log(">> DEPLOY VERIFICATION CONTRACT", "\n");

let targetNetwork;
// Set default network name
if (args[0] == null) {
  const inputtedNetworkName = loadZKGraphDestinations("src/zkgraph.yaml")[0].network;
  targetNetwork = getTargetNetwork(inputtedNetworkName);
} else {
  targetNetwork = getTargetNetwork(args[0]);
}

// Get wasm path
let wasmPath;
if (currentNpmScriptName() === "deploy-local") {
  wasmPath = config.LocalWasmBinPath;
} else if (currentNpmScriptName() === "deploy") {
  wasmPath = config.WasmBinPath;
}

const deployedVerificationContractAddress = await zkgapi.deploy(
  wasmPath,
  targetNetwork.value,
  config.ZkwasmProviderUrl,
  config.UserPrivateKey,
  true
);

logDivider();

if (deployedVerificationContractAddress === "") {
  process.exit(1);
} else {
  process.exit(0);
}
