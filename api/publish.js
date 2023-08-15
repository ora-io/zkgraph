// npm run publish sepolia 0x0000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000 Qmcpu8YNbHpjnEpxe5vUkz8TZYzv8oCbiUGj3a66rNngjQ 0.1
import { program } from "commander";
import { providers, Contract, Wallet } from "ethers";
import {
  addressFactory,
  abiFactory,
  AddressZero,
} from "./common/constants.js";
import { config } from "../config.js";
import { loadZKGraphDestination } from "./common/config_utils.js";
import { getTargetNetwork } from "./common/utils.js";
import { logDivider } from "./common/log_utils.js";

program.version("1.0.0");
program
  .argument(
    "<deployed contract address>",
    "Contract address of deployed verification contract address"
  )
  .argument("<ipfs hash>", "IPFS hash of uploaded zkGraph")
  .argument("<bounty reward per trigger>", "Bounty reward per trigger in ETH");
program.parse(process.argv);
const args = program.args;

// goerli
const inputtedNetworkName = loadZKGraphDestination("src/zkgraph.yaml")[0].network;
// 0x0000000000000000000000000000000000000000
const deployedContractAddress = args[0];
// 0x0000000000000000000000000000000000000000
const destinationContractAddress = loadZKGraphDestination("src/zkgraph.yaml")[0].destination.address;
// Qmcpu8YNbHpjnEpxe5vUkz8TZYzv8oCbiUGj3a66rNngjQ
const ipfsHash = args[1];

// Check if network name is valid
const targetNetwork = getTargetNetwork(inputtedNetworkName);

let bountyRewardPerTrigger = args[2];
// Check if bounty reward input is a valid number
if (isNaN(bountyRewardPerTrigger)) {
  console.log(`[-] BOUNTY REWARD IS NOT A VALID NUMBER.`, "\n");
  logDivider();
  process.exit(1);
}
bountyRewardPerTrigger *= Math.pow(10, 9);

const provider = new providers.getDefaultProvider(
  targetNetwork.name.toLowerCase()
);

const wallet = new Wallet(config.UserPrivateKey, provider);

const factoryContract = new Contract(addressFactory, abiFactory, wallet);

const tx = await factoryContract
  .registry(
    AddressZero,
    bountyRewardPerTrigger,
    deployedContractAddress,
    destinationContractAddress,
    ipfsHash
  )
  .catch((err) => {
    console.log(`[-] ERROR WHEN CONSTRUCTING TX: ${err}`, "\n");
    process.exit(1);
  });

const signedTx = await wallet.signTransaction(tx).catch((err) => {
  console.log(`[-] ERROR WHEN SIGNING TX: ${err}`, "\n");
  process.exit(1);
});

const txReceipt = await tx.wait(1).catch((err) => {
  console.log(`[-] ERROR WHEN WAITING FOR TX: ${err}`, "\n");
  process.exit(1);
});

console.log(`[+] ZKGRAPH PUBLISHED SUCCESSFULLY!`, "\n");
console.log(
  `[*] Transaction confirmed in block ${txReceipt.blockNumber} on ${targetNetwork.name}`
);
console.log(`[*] Transaction hash: ${txReceipt.transactionHash}`, "\n");

logDivider();

process.exit(0);
