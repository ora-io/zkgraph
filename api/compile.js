import { loadZKGraphConfig } from "./common/config_utils.js";
import {
  logDivider,
  concatHexStrings,
  fromHexString,
  currentNpmScriptName,
} from "./common/utils.js";
import { config } from "../config.js";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { execSync } from "child_process";
import { readFileSync } from "fs";

// Log script name
console.log(">> COMPILE", "\n");

let isCompilationSuccess = true;

let watPath;

if (currentNpmScriptName() === "compile-local") {
  // Wat Path
  watPath = config.LocalWasmBinPath.replace(/\.wasm/, ".wat")

  const commands = [
    `npx asc lib/main_local.ts -t ${watPath} -O --noAssert -o ${config.LocalWasmBinPath} --disable bulk-memory --use abort=lib/common/type/abort --exportRuntime --runtime stub`, // note: need --exportRuntime or --bindings esm; (--target release)
  ];

  const combinedCommand = commands.join(" && ");
  try {
    execSync(combinedCommand, { encoding: "utf-8" });
  } catch (error) {
    // Handle or log the error here if required
    isCompilationSuccess = false;
  }

} else if (currentNpmScriptName() === "compile") {
  // Constants
  const mappingPath = "src/mapping.ts";
  const configPath = "src/zkgraph.yaml";
  const wasmPath = config.WasmBinPath;
  const apiEndpoint = config.CompilerServerEndpoint;

  // Wat Path
  watPath = config.WasmBinPath.replace(/\.wasm/, ".wat")

  // Load config
  const [source_address, source_esigs] = loadZKGraphConfig(configPath);
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
    // save file to config.WasmBinPath
    const wasmModuleHex = response.data["wasmModuleHex"];
    const wasmWat = response.data["wasmWat"];
    const message = response.data["message"];
    fs.writeFileSync(wasmPath, fromHexString(wasmModuleHex));
    fs.writeFileSync(watPath, wasmWat);
  }
}

// Log Results
if (isCompilationSuccess) {
    // Log compiled file size by line count
    const compiledFileContent = readFileSync(
      watPath,
      "utf-8"
    );
    const compiledFileLineCount = compiledFileContent.split("\n").length;
    console.log(
      "[*]",
      compiledFileLineCount,
      compiledFileLineCount > 1
        ? "lines"
        : "line",
        `in ${watPath}`
    );

    // Log status
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