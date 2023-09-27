import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
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
const wasm = fs.readFileSync(path.join(dirname,'../', wasmPath));
const wasmUnit8Array = new Uint8Array(wasm);

let { md5, taskId, success } = await zkgapi.setup(
  'poc.wasm',
  wasmUnit8Array,
  cirSz,
  config.UserPrivateKey,
  config.ZkwasmProviderUrl,
  isLocal,
  true,
);

// console.log(err)
// console.log(result)
logDivider();

process.exit(0);
