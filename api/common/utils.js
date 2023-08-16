import BN from "bn.js";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { testNets } from "./constants.js";
import { logDivider } from "./log_utils.js";

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

// https://github.com/zkcrossteam/g1024/blob/916c489fefa65ce8d4ee1a387f2bd4a3dcca8337/src/utils/proof.ts#L7
export function bytesToBN(data) {
  let chunksize = 64;
  let bns = [];
  for (let i = 0; i < data.length; i += 32) {
    const chunk = data.slice(i, i + 32);
    let a = new BN(chunk, "le");
    bns.push(a);
    // do whatever
  }
  return bns;
}

// https://github.com/zkcrossteam/g1024/blob/916c489fefa65ce8d4ee1a387f2bd4a3dcca8337/src/data/image.ts#L95
export function parseArgs(raw) {
  let parsedInputs = new Array();
  for (var input of raw) {
    input = input.trim();
    if (input !== "") {
      let args = ZkWasmUtil.parseArg(input);
      if (args != null) {
        parsedInputs.push(args);
      } else {
        throw Error(`invalid args in ${input}`);
      }
    }
  }
  return parsedInputs.flat();
}

export function getTargetNetwork(inputtedNetworkName) {
  const validNetworkNames = testNets.map((net) => net.name.toLowerCase());
  if (!validNetworkNames.includes(inputtedNetworkName.toLowerCase())) {
    console.log(`[-] NETWORK NAME "${inputtedNetworkName}" IS INVALID.`, "\n");
    console.log(`[*] Valid networks: ${validNetworkNames.join(", ")}.`, "\n");
    logDivider();
    process.exit(1);
  }
  const targetNetwork = testNets.find(
    (net) => net.name.toLowerCase() === inputtedNetworkName.toLowerCase()
  );
  return targetNetwork;
}
