import { program } from "commander";
import { config } from "../config.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";

program.version("1.0.0");

// Log script name
console.log(">> UPLOAD", "\n");

// zkGraph Files Paths
let wasmPath;
if (currentNpmScriptName() === "upload-local") {
  wasmPath = config.LocalWasmBinPath;
} else if (currentNpmScriptName() === "upload") {
  wasmPath = config.WasmBinPath;
}
const yamlPath = "src/zkgraph.yaml";
const mappingPath = "src/mapping.ts";

// User private key
const user_privatekey = config.UserPrivateKey;

const isUploadSuccess = await zkgapi.upload(
  mappingPath,
  wasmPath,
  yamlPath,
  user_privatekey,
  config.PinataEndpoint,
  config.PinataJWT,
  true,
);

logDivider();

if (isUploadSuccess) {
  process.exit(0);
} else {
  process.exit(1);
}
