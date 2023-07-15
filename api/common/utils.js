export function fromHexString(hexString) {
  hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  hexString = hexString.length % 2 ? "0" + hexString : hexString;
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

export function toHexString(bytes) {
  return Buffer.from(bytes).toString("hex");
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

export function logDivider() {
  const line = "=".repeat(process.stdout.columns);
  console.log(line);
}

export function concatHexStrings(hexStrings) {
  let result = "";
  for (let hexString of hexStrings) {
    result += hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  }
  return "0x" + result;
}

export function currentNpmScriptName() {
  return process.env.npm_lifecycle_event;
}

export function logReceiptAndEvents(rawreceiptList, blockid, matchedEventOffsets, filteredEventList) {
  console.log(
    "[*]",
    rawreceiptList.length,
    rawreceiptList.length > 1
      ? "receipts fetched from block"
      : "receipt fetched from block",
    blockid
  );
  console.log(
    "[*]",
    matchedEventOffsets.length / 7,
    matchedEventOffsets.length / 7 > 1 ? "events matched" : "event matched"
  );
  for (let i in filteredEventList) {
    for (let j in filteredEventList[i]) {
      filteredEventList[i][j].prettyPrint(
        "\tTx[" + i + "]Event[" + j + "]",
        false
      );
    }
  }
}
