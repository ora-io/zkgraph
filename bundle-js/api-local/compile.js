import { execSync } from "child_process";
import { readFileSync } from "fs";
import { logDivider } from "../common/utils.js";

// Log script name
console.log(">> COMPILE", "\n");

const commands = [
  "npx asc lib/main_local.ts -t build/zkgraph_local.wat -O --noAssert -o build/zkgraph_local.wasm --disable bulk-memory --use abort=lib/common/type/abort --target release --bindings esm --runtime stub",
];

const combinedCommand = commands.join(" && ");
execSync(combinedCommand, { encoding: "utf-8" });

function getLineCount(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  return lines.length;
}
const compiledFileLineCount = getLineCount("build/zkgraph_local.wat");
console.log(
  "[*]",
  compiledFileLineCount,
  compiledFileLineCount > 1
    ? "lines in build/zkgraph_local.wat"
    : "lines in build/zkgraph_local.wat",
);
console.log("[+] COMPILATION COMPLETE!", "\n");

logDivider();
