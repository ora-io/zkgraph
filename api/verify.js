import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import { config } from "../config.js";
import { logDivider } from "./common/log_utils.js";

// npm run verify 64fee557abfa8fdad38d73f3

program.version("1.0.0");
program.argument("<prove task id>", "Task id of prove task");
program.parse(process.argv);
const args = program.args;

// Log script name
console.log(">> VERIFY PROOF ONCHAIN", "\n");

// Inputs from command line
const taskId = args[0];
const dirname = path.dirname(fileURLToPath(import.meta.url));
const yamlContent = fs.readFileSync(
  path.join(dirname, "../src/zkgraph.yaml"),
  "utf8",
);
const verifyResult = await zkgapi.verify(
  yamlContent,
  taskId,
  config.ZkwasmProviderUrl,
  true,
);

logDivider();

if (verifyResult === true) {
  process.exit(0);
} else {
  process.exit(1);
}
