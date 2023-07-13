import { ethers } from "ethers";

export async function getRawReceipts(ethersProvider, blockid) {
  if (Number.isFinite(blockid)) {
    blockid = "0x" + blockid.toString(16);
  }
  return ethersProvider.send("debug_getRawReceipts", [blockid]);
}

export async function getBlockByNumber(ethersProvider, blockNumber) {
    const fullBlock = await ethersProvider.send(
        'eth_getBlockByNumber',
        [ethers.utils.hexValue(blockNumber), false]
    )
    return fullBlock;
}