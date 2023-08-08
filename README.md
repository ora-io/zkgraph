# zkGraph Template

## Getting Started

To create your zkGraph project based on this template:

Option 1:

Click `Use this template`, and `Creating a new repository`.

Option 2:

Use `gh` cli

```bash
gh repo create zkgraph-new --public --template="https://github.com/hyperoracle/zkgraph.git"
```

### Configuration

After cloning your project, you need to create `config.js` file at root folder based on `config-example.js`

Generate an environment file by running `cp .env-example .env`.

If you wish to use ANKR to create JSON RPC requests to the Ethereum Goerli Testnet then go to https://www.ankr.com/rpc/ and click "Base Goerli Testnet" and then copy the "HTTPS Endpoint" value and paste it as the value of `URL_ANKR_JSON_RPC_GOERLI` in the .env file.

Lastly paste the private key of an Ethereum address that has Goerli Testnet Eth as the value of `PRIVATE_KEY_GOERLI` in the .env file. To obtain Goerli Testnet Eth refer to [this article](https://www.coingecko.com/learn/goerli-eth).

```js
// ./config.js
export const config = {
  // Update your Ethereum JSON RPC provider URL here.
  // Please note that the provider must support debug_getRawReceipts RPC method.
  // Recommended provider: ANKR.
  JsonRpcProviderUrl: "https://{URL_ANKR_JSON_RPC_GOERLI}",
  UserPrivateKey: "0x{PRIVATE_KEY_GOERLI}",
  // ...and other configs.
};
```

> To check if the provider supports the [`debug_getRawReceipts`](https://github.com/ethereum/go-ethereum/pull/24773) JSON RPC method, check if the following returns a response `{"jsonrpc":"2.0","id":42,"result":["...}`. In the example below the argument is the block hash (i.e. 0x3bb580f7645e2bdeb34b226f1b559d22a4a1ba5e2474504e294088389923ebd0) of a block number (i.e. 9438739) on the Goerli Testnet where the provider JSON RPC endpoint was obtained from https://www.allthatnode.com/ethereum.dsrv
```bash
curl -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"debug_getRawReceipts","params":["0x3bb580f7645e2bdeb34b226f1b559d22a4a1ba5e2474504e294088389923ebd0"],"id":42}' https://ethereum-goerli-rpc.allthatnode.com
```

Then run:

```bash
npm install
```

### Quick Start

To test the whole flow of the library, run this after you have done the configuration:

```bash
sh test.sh
```

## Commands

The workflow of local zkGraph development is: `Develop` (code in /src) -> `Compile` (to get compiled wasm image) -> `Execute` (to get expected output) -> `Prove` (to generate input and pre-test for actual proving) -> `Deploy`.

If you encounter any problem, please refer to the [test.sh](./test.sh) for the example usage of the commands.

### Compile Locally

```bash
npm run compile-local
```

### Execute Locally

```bash
npm run exec-local -- {block_id}
```

Note: If using Ethereum Mainnet endpoint then its block 17633573 emits the event `Sync(uint112,uint112)` as specified in src/zkgraph.yaml so when you run `npm run exec-local -- 17633573` it outputs that 1 event matched. The same block number on another network like Goerli may not have emitted that event, so it may be necessary to find a block where it did (if at all) or deploy your own smart contract to a network that emits an event and then add that event to src/zkgraph.yaml with it configured to use that network.

Note: If using Ethereum Goerli Testnet then replace the `block_id` above with a block from https://goerli.etherscan.io/blocks

### Set Up Local Image

```bash
npm run setup-local
```

### Prove Local Image (input generation / pre-test / prove)

```bash
npm run prove-local -- --inputgen {block_id} {expected_state}
npm run prove-local -- --pretest {block_id} {expected_state}
npm run prove-local -- --prove {block_id} {expected_state}
```

### Compile (with Compile Server)

```bash
npm run compile
```

### Set Up Image (Link Compiled with Compiler Server)

```bash
npm run setup
```

### Prove Full Image (Link Compiled with Compiler Server)

```bash
npm run prove -- --inputgen {block_id} {expected_state}
npm run prove -- --pretest {block_id} {expected_state}
npm run prove -- --prove {block_id} {expected_state}
```

### Verifier Contract Interface

```AggregatorVerifier
https://github.com/DelphinusLab/halo2aggregator-s/blob/main/sol/contracts/AggregatorVerifier.sol#L40
```

## Develop

### `config.js`

The configuration (such as blockchain json rpc provider url) for the local development API.

### `src/zkgraph.yaml`

The configuration for the zkGraph.

It specifies information including:

- data source
- target blockchain network
- target smart contract address
- target event
- event handler

### `src/mapping.ts`

The logic of the event handler in AssemblyScript.

It specifies how to handle the event data and generate the output state.

```typescript
export function handleEvents(events: Event[]): Bytes {
  let state = new Bytes(0);
  if (events.length > 0) {
    state = events[0].address;
  }
  require(state.length == 20);
  return state;
}
```

## Resources

More info and API reference can be found in [Hyper Oracle zkGraph docs](https://docs.hyperoracle.io/zkgraph-standards/zkgraph).

## zkGraph Dev Tips

### Development

1. Provable program needs to be compilable and runnable in normal execution runtime first.
2. To running on zkwasm, do not use io syscalls like `console` etc.
3. You may need to use `BigEndian` version functions for Ethereum data structures.
4. For operators of `BigInt` (eg. `+`, `-`, `*`, `/`), use syntax like `a.plus(b)` instead of `a + b` (this still works, but triggers compiler warning).
5. `require` is a cool [Solidity-like](https://docs.soliditylang.org/en/v0.8.20/control-structures.html#error-handling-assert-require-revert-and-exceptions) language feature zkWasm provides, but will trigger warning when using in zkGraph's `mapping.ts`. To ignore the error: when importing, add `// @ts-ignore` after the import line; when using, write something like `require(true ? 1 : 0)` to convert the boolean to number for the ts compiler.

### Optimization

1. Look at (approximate) WASM cost for each operation! Complexer logic (eg. anything with lots of `if` or `string`) usally means more instructions, which means longer proof generation time.
2. Don't use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).
3. Try not to use keywords that may introduce extra global init code e.g. `new`, `static` etc. (`changetype` is fine).

## Lib Dev Tips

1. Don't use `I8.parseInt` because it will be compiled to `i32.extend8_s (aka. Unknown opcode 192 (0xC0) in WASM)`.
2. Try not to use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).
3. Try not to use `FC extensions` opcodes (`<u32>parseInt(...)`, `f64`, or `Math`), because it will be compiled to `Unknown opcode 252 (0xFC) in WASM`, and generates too many instructions.

References: [WebAssembly Opcodes](https://pengowray.github.io/wasm-ops/).

## Structure

This repo has the following folders relevant to zkGraph development:

- `api`: APIs (the scripts in `package.json`) for compile, execute, prove, and deploy zkGraph for testing locally, and fully with zkWASM node.
- `example`: Example zkGraphs.
- `lib`: AssemblyScript library for zkGraph development, with data structure such as Bytes, ByteArray and BigInt.
- `src`: Where your actual zkGraph should be in. Contains `mapping.ts` and `zkgraph.yaml`.

## Thanks

- zkWasm Project: [DelphinusLab/zkWasm](https://github.com/DelphinusLab/zkWasm)
- The Graph AssemblyScript API Specification: [graphprotocol/graph-tooling](https://github.com/graphprotocol/graph-tooling)
- Polywrap BigInt Implementation: [polywrap/as-bigint](https://github.com/polywrap/as-bigint)
- Near Base58 Implementation: [near/as-base58](https://github.com/near/as-base58)
