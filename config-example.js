import 'dotenv/config'

export const config = {
  // Update your Ethereum JSON RPC provider URL here.
  // Please note that the provider must support debug_getRawReceipts RPC method.
  JsonRpcProviderUrl: `https://${process.env.URL_ANKR_JSON_RPC_GOERLI}`,
  // Update your private key here to sign zkWasm messages.
  // Please note that (during testnet phrase) your address balance (in zkWasm server) should > 0;
  UserPrivateKey: `0x${process.env.PRIVATE_KEY_GOERLI}`,

  ZkwasmProviderUrl: "https://zkwasm-explorer.delphinuslab.com:8090",
  CompilerServerEndpoint: "https://compiler.hyperoracle.io/compile",

  WasmBinPath: "build/zkgraph_full.wasm",
  LocalWasmBinPath: "build/zkgraph_local.wasm",
};
