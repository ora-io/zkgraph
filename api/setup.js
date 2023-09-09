import { config } from "../config.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import { program } from "commander";

program.version("1.0.0");

program.option("-k, --circuit-size <size>", "Circuit size (k in 2^k) of image");

program.parse(process.argv);

const args = program.args;
const options = program.opts();

let wasmPath;
let isLocal;
let cirSz = options.circuitSize === undefined ? undefined : parseInt(options.circuitSize);
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

let {md5, taskId, success} = await zkgapi.setup(
    wasmPath,
    cirSz,
    config.UserPrivateKey,
    config.ZkwasmProviderUrl,
    isLocal,
    true
);

// console.log(err)
// console.log(result)
logDivider();

console.log(cirSz)

process.exit(1);
