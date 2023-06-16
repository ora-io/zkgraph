import { providers, utils } from "ethers";

import { handleEvent } from "../build/mapping.js";

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
  return Buffer.from(byteArray).toString("hex");
}

function callWasm(eventSig, topic1, topic2, topic3, data) {
  let output = handleEvent(
    hexToUint8Array(eventSig),
    hexToUint8Array(topic1),
    hexToUint8Array(topic2),
    hexToUint8Array(topic3),
    hexToUint8Array(data)
  );

  return uint8array2str(output);
}

function generateInput(eventSig, topic1, topic2, topic3, data, output) {
  if (data.startsWith("0x")) {
    data = data.slice(2);
  }
  let dataLength = data.length / 2;

  if (output.startsWith("0x")) {
    output = output.slice(2);
  }
  let outputLength = output.length / 2;

  let pubInputs = `${eventSig}:bytes-packed ${topic1}:bytes-packed ${topic2}:bytes-packed ${topic3}:bytes-packed 0x${dataLength.toString(
    16
  )}:i64 0x${data}:bytes-packed 0x${outputLength.toString(16)}:i64 0x${output}:bytes-packed`;
  return pubInputs;
}

let log = await geLastLog(
  provider,
  "0x8c09571bc1932fEb1367853bA26e1f5Dc9e1249b",
  "0x9825d7590e5c31b6cd3fd4e12a4afff309b64d6a9aedead86ae80997ac6aaea6",
  "Sync(uint112,uint112)"
);

let emptyValue = "0x" + "0".repeat(64);
let [eventSig, topic1 = emptyValue, topic2 = emptyValue, topic3 = emptyValue] =
  log.topics;
let data = log.data || emptyValue;
// let data =
//   "0x000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001c";

let output = callWasm(eventSig, topic1, topic2, topic3, data);
console.log(output);

let proof = generateInput(eventSig, topic1, topic2, topic3, data, output);
console.log(proof);
