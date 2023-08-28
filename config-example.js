export const config = {
  // Update your Etherum JSON RPC provider URL here.
  // Please note that the provider must support debug_getRawReceipts RPC method.
  JsonRpcProviderUrlMainnet: "https://{URL}", // Optional
  JsonRpcProviderUrlSepolia: "https://{URL}", // Optional
  JsonRpcProviderUrlGoerli: "https://{URL}",  // Optional
  // Update your private key here to sign zkwasm messages.
  // Please note that (during testnet phrase) your address balance (in zkwasm server) should > 0;
  UserPrivateKey: "0x{PRIVATE_KEY}",

  ZkwasmProviderUrl: "https://zkwasm-explorer.delphinuslab.com:8090",
  CompilerServerEndpoint: "http://compiler.hyperoracle.io:8123/compile",
  PinataEndpoint: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  PinataJWT: "eyJhbGc...",

  WasmBinPath: "build/zkgraph_full.wasm",
  LocalWasmBinPath: "build/zkgraph_local.wasm",
};
