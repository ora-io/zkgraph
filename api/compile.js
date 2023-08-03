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

const localCompile = (wasmPath, watPath) => {
  const commands = [
    `npx asc lib/main_local.ts -t ${watPath} -O --noAssert -o ${wasmPath} --disable bulk-memory --use abort=lib/common/type/abort --exportRuntime --runtime stub`, // note: need --exportRuntime or --bindings esm; (--target release)
  ];

  const combinedCommand = commands.join(" && ");
  try {
    execSync(combinedCommand, { encoding: "utf-8" });
  } catch (error) {
    // Handle or log the error here if required
    isCompilationSuccess = false;
  }
};

const remoteCompile = async (wasmPath, watPath) => {
  // Constants
  const mappingPath = "src/mapping.ts";
  const configPath = "src/zkgraph.yaml";
  const apiEndpoint = config.CompilerServerEndpoint;

  // Load config
  const [source_address, source_esigs] = loadZKGraphConfig(configPath);
  console.log("[*] Source contract address:", source_address);
  console.log("[*] Source events signatures:", source_esigs, "\n");

  // Set up form data
  let data = new FormData();
  data.append("asFile", fs.createReadStream(mappingPath));
  data.append("yamlFile", fs.createReadStream(configPath));

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
    console.log(`[-] ${error.message} ${error.code}`, "\n");
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
};

if (currentNpmScriptName() === "compile-local") {
  // Wat Path
  watPath = config.LocalWasmBinPath.replace(/\.wasm/, ".wat");

  // Compile Locally
  localCompile(config.LocalWasmBinPath, watPath);
} else if (currentNpmScriptName() === "compile") {
  // Test Compile Erro with Local Compile
  localCompile("build/tmp.wasm", "build/tmp.wat");

  // Only Call Compile Server When No Local Compile Errors
  if (isCompilationSuccess == true) {
    // Wat Path
    watPath = config.WasmBinPath.replace(/\.wasm/, ".wat");

    // Compile with Remote Compile Server
    await remoteCompile(config.WasmBinPath, watPath);
  }
}

// Log Results
if (isCompilationSuccess) {
  // Log compiled file size by line count
  const compiledFileContent = readFileSync(watPath, "utf-8");
  const compiledFileLineCount = compiledFileContent.split("\n").length;
  console.log(
    "[*]",
    compiledFileLineCount,
    compiledFileLineCount > 1 ? "lines" : "line",
    `in ${watPath}`,
  );

  // Log status
  console.log("[+] Output written to `build` folder.");
  console.log("[+] COMPILATION SUCCESS!", "\n");

  logDivider();

  process.exit(0);
} else {
  // Log status
  console.log("[-] ERROR WHEN COMPILING." + "\n");

  logDivider();

  process.exit(1);
}
