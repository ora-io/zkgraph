import { execSync } from "child_process";
import { readFileSync } from "fs";
import { logDivider } from "../common/utils.js";

// Log script name
console.log(">> COMPILE", "\n");

let isCompilationSuccess = true;

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
  const compiledFileContent = readFileSync("build/zkgraph_local.wat", "utf-8");
  const compiledFileLineCount = compiledFileContent.split("\n").length;
  console.log(
    "[*]",
    compiledFileLineCount,
    compiledFileLineCount > 1
      ? "lines in build/zkgraph_local.wat"
      : "line in build/zkgraph_local.wat",
  );

  // Log status
  console.log("[+] COMPILATION SUCCESS!", "\n");

  logDivider();

  process.exit(0);
} else {
  // Extra new line for error
  console.log();

  // Log status
  console.log("[-] ERROR WITH COMPILING.", "\n");

  logDivider();

  process.exit(1);
}
