import { program } from "commander";
import { config } from "../config.js";
import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { pinata_upload } from "./requests/pinata_upload.js";
import { loadZKGraphName } from "./common/config_utils.js";

program.version("1.0.0");

// Log script name
console.log(">> UPLOAD", "\n");

// zkGraph Name
const zkGraphName = loadZKGraphName("src/zkgraph.yaml") === null ? "zkGraph" : loadZKGraphName("src/zkgraph.yaml");

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

let [response, isUploadSuccess, errorMessage] = await pinata_upload(
  user_privatekey,
  wasmPath,
  mappingPath,
  yamlPath,
  zkGraphName
);

if (isUploadSuccess) {
  console.log(`[+] IPFS UPLOAD SUCCESS!`, "\n");

  console.log(`[+] IPFS HASH: ${response.data.IpfsHash}`, "\n");

  if (response.data.isDuplicate) {
    console.log(`[*] Please note that this upload is duplicated.`, "\n");
  }

  logDivider();

  process.exit(0);
} else {
  console.log(`[-] IPFS UPLOAD FAILED.`, "\n");

  console.log(`[-] ${errorMessage}`, "\n");

  logDivider();

  process.exit(1);
}
