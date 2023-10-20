import fs from "fs";
import axios from "axios";
import axiosRetry from "axios-retry";
import FormData from "form-data";
import { networks } from "./constants.js";
import { logDivider } from "./log_utils.js";
import { loadZKGraphDestinations, loadZKGraphSources } from "./config_utils.js";
import { config } from "../../config.js";
import { TdConfig } from "../common/constants.js";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
});

export function fromHexString(hexString) {
  hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  hexString = hexString.length % 2 ? "0" + hexString : hexString;
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

export function toHexString(bytes) {
  return Buffer.from(bytes).toString("hex");
}

export function toHexStringBytes32Reverse(arr) {
  let result = "";
  for (let i = 0; i < arr.length / 32; i++) {
    result +=
      "0x" + toHexString(arr.slice(i * 32, (i + 1) * 32).reverse()) + "\n";
  }
  return result;
}

export function areEqualArrays(first, second) {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

export function trimPrefix(str, prefix) {
  if (str.startsWith(prefix)) {
    str = str.substring(prefix.length);
  }
  return str;
}

export function concatHexStrings(hexStrings) {
  let result = "";
  for (let hexString of hexStrings) {
    result += hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  }
  return "0x" + result;
}

export function getTargetNetwork(inputtedNetworkName) {
  const validNetworkNames = networks.map((net) => net.name.toLowerCase());
  if (!validNetworkNames.includes(inputtedNetworkName.toLowerCase())) {
    console.log(`[-] NETWORK NAME "${inputtedNetworkName}" IS INVALID.`, "\n");
    console.log(`[*] Valid networks: ${validNetworkNames.join(", ")}.`, "\n");
    logDivider();
    process.exit(1);
  }
  const targetNetwork = networks.find(
    (net) => net.name.toLowerCase() === inputtedNetworkName.toLowerCase(),
  );
  return targetNetwork;
}

/*
 * @param {string} yamlPath of zkgraph.yaml
 * @param {boolean} isDataSource, if true, return the first data source, else return the first data destination
 * @returns {object} JsonRpcProviderUrl from config.js
 */
export function loadJsonRpcProviderUrl(yamlPath, isDataSource) {
  let network;
  // For exec and prove, we need to load the data source network
  if (isDataSource) {
    network = loadZKGraphSources(yamlPath)[0].network;
  }
  // For publish, we need to load the data destination network
  else {
    network = loadZKGraphDestinations(yamlPath)[0].network;
  }

  // Check if the network is defined in config.js with "JsonRpcProviderUrl" + network.name (eg. "Goerli")
  const JsonRpcProviderUrl =
    config["JsonRpcProviderUrl"][getTargetNetwork(network).name.toLowerCase()];
  if (!JsonRpcProviderUrl) {
    console.log(
      `[-] JSON RPC PROVIDER URL FOR NETWORK "${network}" IS NOT DEFINED IN CONFIG.JS.`,
      "\n",
    );
    logDivider();
    process.exit(1);
  }

  return JsonRpcProviderUrl;
}

export async function validateProvider(ethersProvider) {
  try {
    await ethersProvider.detectNetwork();
  } catch (err) {
    if (err.code == "NETWORK_ERROR") {
      throw new Error(
        "[-] could not detect network, please provide a valid provider in config.js",
      );
    } else {
      throw err;
    }
  }
}

export async function queryTaskId(txhash) {
  const response = await axios.get(
    `${TdConfig.queryrApi}/task?txhash=${txhash}`,
  );
  const taskId = response.data.task.id;
  return taskId;
}

export async function uoloadWasmToTd(wasmPath) {
  let data = new FormData();
  data.append("file", fs.createReadStream(wasmPath));

  let requestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${TdConfig.queryrApi}/upload`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  const response = await axios.request(requestConfig).catch((error) => {
    throw error;
  });

  return response.data.filename;
}
