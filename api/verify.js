import { program } from "commander";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import { config } from "../config.js";
import { logDivider } from "./common/log_utils.js";

// npm run verify 64e52295abac08978a0e46cf

program.version("1.0.0");
program.argument("<prove task id>", "Task id of prove task");
program.parse(process.argv);
const args = program.args;

// Log script name
console.log(">> VERIFY PROOF ONCHAIN", "\n");

// Inputs from command line
const taskId = args[0];

const verifyResult = await zkgapi.verify(
  "src/zkgraph.yaml",
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
