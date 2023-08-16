import { ethers, Wallet, providers } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { config } from "../../config.js";

export async function getRawReceipts(ethersProvider, blockid) {
  if (Number.isFinite(blockid)) {
    blockid = "0x" + blockid.toString(16);
  }
  return ethersProvider.send("debug_getRawReceipts", [blockid]);
}

export async function getBlockByNumber(ethersProvider, blockNumber) {
  const fullBlock = await ethersProvider.send("eth_getBlockByNumber", [
    ethers.utils.hexValue(blockNumber),
    false,
  ]);
  return fullBlock;
}

export async function getBalance(privateKey, networkName) {
  const wallet = new Wallet(privateKey);
  // Using default provider to avoid errors in user defined provider
  const provider = new providers.getDefaultProvider(networkName)
  const balance = formatEther(await provider.getBalance(wallet.address));
  return balance;
}
