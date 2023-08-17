import { config } from "../config.js";
import { currentNpmScriptName, logDivider, logLoadingAnimation } from "./common/log_utils.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";

let wasmPath;
let isLocal;
let cirSz;
if (currentNpmScriptName() === "setup-local") {
  wasmPath = config.LocalWasmBinPath;
  isLocal = true
    cirSz = 20;
} else if (currentNpmScriptName() === "setup") {
  wasmPath = config.WasmBinPath;
  isLocal = false
    cirSz = 22;
}

// Log script name
console.log(">> SET UP", "\n");

let [err, result] = await zkgapi.setup(
    wasmPath, 
    cirSz,
    config.UserPrivateKey, 
    config.ZkwasmProviderUrl, 
    isLocal, 
    true
);

// console.log(err)
// console.log(result)

process.exit(1);