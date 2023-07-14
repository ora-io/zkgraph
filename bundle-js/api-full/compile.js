import { loadConfig } from "../common/config.js";
import {
  logDivider,
  concatHexStrings,
  fromHexString,
} from "../common/utils.js";
import { config } from "../../config.js";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

// Log script name
console.log(">> COMPILE", "\n");
let isCompilationSuccess = true;

// Constants
const mappingPath = "src/mapping.ts";
const configPath = "src/zkgraph.yaml";
const outputPathPrefix = "build/zkgraph_full";
const apiEndpoint = config.CompilerServerEndpoint;

// Load config
const [source_address, source_esigs] = loadConfig(configPath);
console.log("[*] Source contract address:", source_address);
console.log("[*] Source events signatures:", source_esigs, "\n");

// Set up form data
let data = new FormData();
data.append("file", fs.createReadStream(mappingPath));
data.append("source_address", source_address);
data.append("source_sigs_array", concatHexStrings(source_esigs));

// Set up request config
let requestConfig = {
  method: "post",
  maxBodyLength: Infinity,
  url: apiEndpoint,
  headers: {
    ...data.getHeaders(),
  },
  data: data,
};

// Send request
const response = await axios.request(requestConfig).catch((error) => {
  isCompilationSuccess = false;
});

if (isCompilationSuccess) {
  // save file to build/zkgraph_full.wasm
  const wasmModuleHex = response.data["wasmModuleHex"];
  const wasmWat = response.data["wasmWat"];
  const message = response.data["message"];
  fs.writeFileSync(outputPathPrefix + ".wasm", fromHexString(wasmModuleHex));
  fs.writeFileSync(outputPathPrefix + ".wat", wasmWat);

  console.log("[+] Output written to `build` folder.");
  console.log("[+] COMPILATION SUCCESS!", "\n");

  logDivider();

  process.exit(0);
} else {
  // Extra new line for error
  console.log();

  // Log status
  console.log("[-] ERROR WHEN COMPILING.", "\n");

  logDivider();

  process.exit(1);
}
