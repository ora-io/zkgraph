import { program } from "commander";
import { parseArgs, bytesToBN } from "./common/utils.js";
import { logDivider } from "./common/log_utils.js";
import { testNets, contract_abi } from "./common/constants.js";
import { waitTaskStatus } from "./requests/zkwasm_taskdetails.js";
import { zkwasm_imagedetails } from "./requests/zkwasm_imagedetails.js";
import Web3EthContract from "web3-eth-contract";

// npm run verify sepolia 64d1e997f0e3eee93f7f63ed
// npm run verify goerli 64d09a94f0e3eee93f7e8e04

program.version("1.0.0");
program
  .argument(
    "<network name>",
    "Name of deployed network for verification contract"
  )
  .argument("<prove task id>", "Task id of prove task");
program.parse(process.argv);
const args = program.args;

// Log script name
console.log(">> VERIFY PROOF ONCHAIN", "\n");

// Inputs from command line
const inputtedNetworkName = args[0];
const taskId = args[1];

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

// Check task status of prove.
const taskDetails = await waitTaskStatus(taskId, ["Done", "Fail"], 3000, 0); //TODO: timeout
if (taskDetails.status !== "Done") {
  console.log("[-] PROVE TASK IS NOT DONE. EXITING...", "\n");
  logDivider();
  process.exit(1);
}

// Get deployed contract address of verification contract.
const imageId = taskDetails.md5;
const [imageStatus, error] = await zkwasm_imagedetails(imageId);
const imageDeployment = imageStatus.data.result[0].deployment;
const deployedContractInfo = imageDeployment.find(
  (x) => x.chain_id === targetNetwork.value
);
if (!deployedContractInfo) {
  console.log(
    `[-] DEPLOYED CONTRACT ADDRESS ON TARGET NETWORK IS NOT FOUND. EXITING...`,
    "\n"
  );
  logDivider();
  process.exit(1);
}
const deployedContractAddress = deployedContractInfo.address;

// Inputs for verification
const instances = bytesToBN(taskDetails.instances);
const proof = bytesToBN(taskDetails.proof);
const aux = bytesToBN(taskDetails.aux);
let arg = parseArgs(taskDetails.public_inputs).map((x) => x.toString(10));
if (arg.length === 0) arg = [0];

if (targetNetwork.value === 5) {
  Web3EthContract.setProvider("https://rpc.ankr.com/eth_goerli");
}
if (targetNetwork.value === 11155111) {
  Web3EthContract.setProvider("https://rpc2.sepolia.org");
}
let contract = new Web3EthContract(contract_abi.abi, deployedContractAddress);

const result = await contract.methods
  .verify(proof, instances, aux, [arg])
  .call()
  .catch((err) => {
    console.log(`[-] VERIFICATION FAILED.`, "\n");
    console.log(`[*] Error: ${err}`, "\n");
    logDivider();
    process.exit(1);
  });

console.log(`[+] VERIFICATION SUCCESS!`, "\n");
process.exit(0);
