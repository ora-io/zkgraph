export const config = {
  // Update your Etherum JSON RPC provider URL here.
  // Please note that the provider must support debug_getRawReceipts RPC method.
  JsonRpcProviderUrl: "https://{URL}",
  // Update your private key here to sign zkwasm messages.
  // Please note that (during testnet phrase) your address balance (in zkwasm server) should > 0;
  UserPrivateKey: "0x{PRIVATE_KEY}",

  ZkwasmProviderUrl: "https://zkwasm-explorer.delphinuslab.com:8090",
  CompilerServerEndpoint: "https://compiler.hyperoracle.io/compile",

  WasmBinPath: "build/zkgraph_full.wasm",
  LocalWasmBinPath: "build/zkgraph_local.wasm",
};
