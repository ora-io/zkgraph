// npm run publish sepolia 0x0000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000 Qmcpu8YNbHpjnEpxe5vUkz8TZYzv8oCbiUGj3a66rNngjQ 0.1
import { program } from "commander";
import { providers, Contract, Wallet } from "ethers";
import {
  addressFactory,
  abiFactory,
  AddressZero,
  testNets,
} from "./common/constants.js";
import { config } from "../config.js";
import { logDivider } from "./common/utils.js";

program.version("1.0.0");
program
  .argument(
    "<network name>",
    "Name of network for publishing and registering zkGraph (same as verification contract)"
  )
  .argument(
    "<deployed contract address>",
    "Contract address of deployed verification contract address"
  )
  .argument(
    "<destination contract address>",
    "Contract address of destination contract address for zkAutomation triggered calls"
  )
  .argument("<ipfs hash>", "IPFS hash of uploaded zkGraph")
  .argument("<bounty reward per trigger>", "Bounty reward per trigger in ETH");
program.parse(process.argv);
const args = program.args;

// goerli
const inputtedNetworkName = args[0];
// 0x0000000000000000000000000000000000000000
const deployedContractAddress = args[1];
// 0x0000000000000000000000000000000000000000
const destinationContractAddress = args[2];
// Qmcpu8YNbHpjnEpxe5vUkz8TZYzv8oCbiUGj3a66rNngjQ
const ipfsHash = args[3];

// Check if network name is valid
const validNetworkNames = testNets.map((net) => net.name.toLowerCase());
if (!validNetworkNames.includes(inputtedNetworkName.toLowerCase())) {
  console.log(`[-] NETWORK NAME IS INVALID.`, "\n");
  console.log(`[*] Valid networks: ${validNetworkNames.join(", ")}.`, "\n");
  logDivider();
  process.exit(1);
}
const targetNetwork = testNets.find(
  (net) => net.name.toLowerCase() === inputtedNetworkName.toLowerCase()
);

let bountyRewardPerTrigger = args[4];
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
