import { currentNpmScriptName, logDivider } from "./common/log_utils.js";
import { config } from "../config.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";

// Log script name
console.log(">> COMPILE", "\n");

let isCompilationSuccess;

if (currentNpmScriptName() === "compile-local") {
  // Compile Locally
  isCompilationSuccess = await zkgapi.compile(
    config.LocalWasmBinPath,
    config.LocalWasmBinPath.replace(/\.wasm/, ".wat"),
    "",
    "",
    config.CompilerServerEndpoint,
    true,
    true
  );
} else if (currentNpmScriptName() === "compile") {
  // Test Compile Erro with Local Compile
  isCompilationSuccess = await zkgapi.compile(
    "build/tmp.wasm",
    "build/tmp.wat",
    "",
    "",
    config.CompilerServerEndpoint,
    true,
    false
  );

  // Only Call Compile Server When No Local Compile Errors
  if (isCompilationSuccess === true) {
    isCompilationSuccess = await zkgapi.compile(
      config.WasmBinPath,
      config.WasmBinPath.replace(/\.wasm/, ".wat"),
      "src/mapping.ts",
      "src/zkgraph.yaml",
      config.CompilerServerEndpoint,
      false,
      true
    );
  }
}

logDivider();

process.exit(0);
