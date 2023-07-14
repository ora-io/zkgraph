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

if (currentNpmScriptName() === "compile-local") {
  const commands = [
    "npx asc lib/main_local.ts -t build/zkgraph_local.wat -O --noAssert -o build/zkgraph_local.wasm --disable bulk-memory --use abort=lib/common/type/abort --target release --bindings esm --runtime stub",
  ];

  const combinedCommand = commands.join(" && ");
  try {
    execSync(combinedCommand, { encoding: "utf-8" });
  } catch (error) {
    // Handle or log the error here if required
    isCompilationSuccess = false;
  }

  if (isCompilationSuccess) {
    // Log compiled file size by line count
    const compiledFileContent = readFileSync(
      "build/zkgraph_local.wat",
      "utf-8"
    );
    const compiledFileLineCount = compiledFileContent.split("\n").length;
    console.log(
      "[*]",
      compiledFileLineCount,
      compiledFileLineCount > 1
        ? "lines in build/zkgraph_local.wat"
        : "line in build/zkgraph_local.wat"
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
} else if (currentNpmScriptName() === "compile") {
  // Constants
  const mappingPath = "src/mapping.ts";
  const configPath = "src/zkgraph.yaml";
  const outputPathPrefix = "build/zkgraph_full";
  const apiEndpoint = config.CompilerServerEndpoint;

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
}
