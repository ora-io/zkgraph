import { asmain } from "../../bundle/js/bundle_local.js";
import { providers } from "ethers";
import { getRawReceipts } from "../../bundle/js/ethers_helper.js";
import { concatRawRlpList } from "../../bundle/js/txreceipt.js";
import { toHexString } from "../../bundle/js/utils.js";

// Constants
const PROVIDER = new providers.JsonRpcProvider(
  "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7"
);
const BLOCKID = 0x104b758;

// Helper for formatting inputs for zkwasm
const formattedInputs = (rawReceipts, matchedEventOffsets, expectedState) => {
  return `0x${rawReceipts.length / 2}:i64 0x${rawReceipts}:bytes-packed 0x${
    matchedEventOffsets.length / 2
  }:i64 0x${matchedEventOffsets}:bytes-packed 0x${
    expectedState.length / 2
  }:i64 0x${expectedState}:bytes-packed`;
};

// Initiate actual inputs for testing
const rawReceipts = concatRawRlpList(await getRawReceipts(PROVIDER, BLOCKID));
const matchedEventOffsets = Uint32Array.from([
  711, 733, 0, 0, 0, 767, 64, 711, 733, 0, 0, 0, 767, 64,
]);
const expectedState = asmain(rawReceipts, matchedEventOffsets);

// Print state and inputs for zkwasm
console.log("ZKGRAPH OUTPUT:");
console.log(toHexString(expectedState), "\n");

// Print inputs for zkwasm
console.log("INPUT FOR ZKWASM:");
console.log(
  formattedInputs(
    toHexString(rawReceipts),
    toHexString(matchedEventOffsets),
    toHexString(expectedState)
  )
);
