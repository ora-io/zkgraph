export async function getRawReceipts(ethersProvider, blockid) {
  if (Number.isFinite(blockid)) {
    blockid = "0x" + blockid.toString(16);
  }
  return ethersProvider.send("debug_getRawReceipts", [blockid]);
}
