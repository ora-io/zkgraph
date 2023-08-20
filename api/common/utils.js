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
