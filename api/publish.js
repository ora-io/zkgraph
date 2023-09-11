// npm run publish 0x0000000000000000000000000000000000000000 Qmcpu8YNbHpjnEpxe5vUkz8TZYzv8oCbiUGj3a66rNngjQ 0.1
import { program } from "commander";
import { logDivider } from "./common/log_utils.js";
import * as zkgapi from "@hyperoracle/zkgraph-api";
import { config } from "../config.js";
import { loadJsonRpcProviderUrl } from "./common/utils.js";

program.version("1.0.0");
program
  .argument(
    "<deployed contract address>",
    "Contract address of deployed verification contract address",
  )
  .argument("<ipfs hash>", "IPFS hash of uploaded zkGraph")
  .argument("<bounty reward per trigger>", "Bounty reward per trigger in ETH");
program.parse(process.argv);
const args = program.args;

// Log script name
console.log(">> PUBLISH ZKGRAPH", "\n");

// 0x0000000000000000000000000000000000000000
const deployedContractAddress = args[0];
// Qmcpu8YNbHpjnEpxe5vUkz8TZYzv8oCbiUGj3a66rNngjQ
const ipfsHash = args[1];
// 0.1
let bountyRewardPerTrigger = args[2];
// Check if bounty reward input is a valid number
if (isNaN(bountyRewardPerTrigger)) {
  console.log(`[-] BOUNTY REWARD IS NOT A VALID NUMBER.`, "\n");
  logDivider();
  process.exit(1);
}
bountyRewardPerTrigger *= Math.pow(10, 9);

const JsonRpcProviderUrl = loadJsonRpcProviderUrl("src/zkgraph.yaml", false);

const publishTxHash = await zkgapi.publish(
  "src/zkgraph.yaml",
  JsonRpcProviderUrl,
  deployedContractAddress,
  ipfsHash,
  bountyRewardPerTrigger,
  config.UserPrivateKey,
  true,
);

logDivider();

if (publishTxHash === "") {
  process.exit(1);
} else {
  process.exit(0);
}
