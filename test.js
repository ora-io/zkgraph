import { providers, utils } from "ethers";
import { instantiate } from "./build/module.js";

function hexToUint8Array(hex) {
  if (hex.startsWith("0x")) {
    hex = hex.substring(2);
  }
  let arr = [];
  for (let i = 0, l = hex.length; i < l; i += 2) {
    arr.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(arr);
}

function uint8array2str(byteArray) {
  const encoder = new TextEncoder();
  const str = encoder.encode(byteArray);
  const decoder = new TextDecoder();
  return decoder.decode(str);
}

async function callWasm(eventSig, topic1, topic2, topic3, data) {
  const exports = await instantiate(
    await WebAssembly.compileStreaming(fetch("./build/module.wasm")),
    {}
  );
  let output = exports.handleEvent(
    hexToUint8Array(eventSig),
    hexToUint8Array(topic1),
    hexToUint8Array(topic2),
    hexToUint8Array(topic3),
    hexToUint8Array(data)
  );

  return uint8array2str(output);
}

const provider = new providers.JsonRpcProvider("https://eth.llamarpc.com");

async function geLastLog(provider, address, txhash, eventName) {
  let lastLog = null;
  let expectTopic = utils.id(eventName);
  const receipt = await provider.getTransactionReceipt(txhash);
  for (let j = receipt.logs.length - 1; j >= 0; j--) {
    const log = receipt.logs[j];
    const logTopic = log.topics[0];
    if (logTopic === expectTopic && log.address == address) {
      lastLog = log;
      break;
    }
  }

  return lastLog;
}

function generateInput(eventSig, topic1, topic2, topic3, data, output) {
  let dataLength = data.length;
  if (data.startsWith("0x")) {
    dataLength = dataLength - 2;
  }
  dataLength = dataLength / 2;

  let publicinput = new Array(7);
  publicinput[0] = `${eventSig}:bytes-packed`;
  publicinput[1] = `${topic1}:bytes-packed`;
  publicinput[2] = `${topic2}:bytes-packed`;
  publicinput[3] = `${topic3}:bytes-packed`;
  publicinput[4] = `0x${dataLength.toString(16)}:i64`;
  publicinput[5] = `${data}:bytes-packed`;
  publicinput[6] = `${output}:bytes-packed`;

  return publicinput;
}

let log = await geLastLog(
  provider,
  "0x8c09571bc1932fEb1367853bA26e1f5Dc9e1249b",
  "0x9825d7590e5c31b6cd3fd4e12a4afff309b64d6a9aedead86ae80997ac6aaea6",
  "Sync(uint112,uint112)"
);

console.log(log);

let emptyValue = "0x" + "0".repeat(64);
let [eventSig, topic1 = emptyValue, topic2 = emptyValue, topic3 = emptyValue] =
  log.topics;
let data = log.data || emptyValue;

let output = await callWasm(eventSig, topic1, topic2, topic3, data);
console.log(output);

let proof = generateInput(eventSig, topic1, topic2, topic3, data, output);
console.log(proof);
