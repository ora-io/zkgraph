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
    true,
  );
} else if (currentNpmScriptName() === "compile") {
  // Compile Remotely
  let isCompilationSuccess = await zkgapi.compile(
    config.WasmBinPath,
    config.WasmBinPath.replace(/\.wasm/, ".wat"),
    "src/mapping.ts",
    "src/zkgraph.yaml",
    config.CompilerServerEndpoint,
    false,
    true,
  );
}

logDivider();

process.exit(0);
