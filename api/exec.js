import { program } from "commander";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { config } from "../config.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import { loadJsonRpcProviderUrl, validateProvider } from "./common/utils.js";
import { providers } from "ethers";

program.version("1.0.0");

program.argument(
  "<block id>",
  "Block number (or block hash) as runtime context",
);
program.parse(process.argv);
const args = program.args;

// const blockid = args[0].length >= 64 ? args[0] : parseInt(args[0]); //17633573
const blockid = parseInt(args[0]);

// Log script name
console.log(">> EXEC", "\n");

// Declare Wasm Binary Path
let wasmPath;
let isLocal;

if (currentNpmScriptName() === "exec-local") {
  isLocal = true;
  wasmPath = config.LocalWasmBinPath;
} else if (currentNpmScriptName() === "exec") {
  isLocal = false;
  wasmPath = config.WasmBinPath;
}

let basePath = import.meta.url + "/../../";

const JsonRpcProviderUrl = loadJsonRpcProviderUrl("src/zkgraph.yaml", true);
const provider = new providers.JsonRpcProvider(JsonRpcProviderUrl);
await validateProvider(provider);

let rawReceiptList = await zkgapi.getRawReceipts(provider, blockid, false);

let state = await zkgapi.executeOnRawReceipts(
  basePath,
  wasmPath,
  "src/zkgraph.yaml",
  rawReceiptList,
  isLocal,
  true,
);

// console.log("[+] ZKGRAPH STATE OUTPUT:", toHexString(state), "\n");

logDivider();

process.exit(0);
