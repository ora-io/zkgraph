import { providers, utils } from "ethers";

import { handleEvent } from '../build/mapping.js';

const provider = new providers.JsonRpcProvider(
  "https://eth.llamarpc.com"
);

async function geLastLog(provider, txhash, eventName) {
  let lastLog = null;
  let expectTopic = utils.id(eventName);
  const receipt = await provider.getTransactionReceipt(txhash);
  for (let j = receipt.logs.length - 1; j >= 0; j--) {
    const log = receipt.logs[j];
    const logTopic = log.topics[0];
    if (logTopic === expectTopic) {
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

let log = await geLastLog(
  provider,
  "0x9825d7590e5c31b6cd3fd4e12a4afff309b64d6a9aedead86ae80997ac6aaea6",
  "Sync(uint112,uint112)"
);

let [eventSig, topic1 = "", topic2 = "", topic3 = ""] = log.topics;
let data = log.data || "";
console.log(data)

let res = handleEvent(
  hexToUint8Array(eventSig),
  hexToUint8Array(topic1),
  hexToUint8Array(topic2),
  hexToUint8Array(topic3),
  hexToUint8Array(data)
);
console.log(res);
