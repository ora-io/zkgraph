import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { config } from "../config.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";

// Log script name
console.log(">> COMPILE", "\n");

if (currentNpmScriptName() === "compile-local") {
  // Compile Locally
    let isCompilationSuccess = await zkgapi.compile(
    config.LocalWasmBinPath,
    config.LocalWasmBinPath.replace(/\.wasm/, ".wat"),
    "",
    "",
    config.CompilerServerEndpoint,
    true,
    true
  );

} else if (currentNpmScriptName() === "compile") {
  // remove this pre test because now we have compile inner.
  // Test Compile Erro with Local Compile

//   isCompilationSuccess = await zkgapi.compile(
//     "build/tmp/tmp.wasm",
//     "build/tmp/tmp.wat",
//     "",
//     "",
//     config.CompilerServerEndpoint,
//     true,
//     false
//   );
//   console.log("local compile succ")

  // Only Call Compile Server When No Local Compile Errors
  
  let isCompilationSuccess = await zkgapi.compile(
      config.WasmBinPath,
      config.WasmBinPath.replace(/\.wasm/, ".wat"),
      "src/mapping.ts",
      "src/zkgraph.yaml",
      config.CompilerServerEndpoint,
      false,
      true
    );
}

logDivider();

process.exit(0);
