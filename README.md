# zkGraph SDK and Library

## Develop zkGraph

### Getting Started

First, fork this repo, and clone your forked repo. Then, run:

```bash
git update-index --skip-worktree config.js
npm install
```

To test the whole flow of the library locally, update `config.js` file with your data, then run:

```bash
sh test.sh
```

## Usage Example

### Compile Locally

```bash
npm run compile-local
```

### Execute Locally

```bash
npm run exec-local -- {block_id}
```

### Prove Local (input generation / pre-test)

```bash
npm run prove-local -- --inputgen {block_id} {expected_state}
npm run prove-local -- --pretest {block_id} {expected_state}
```

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
2. Don't use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).
3. Don't use `FC extensions` opcodes, because it will be compiled to `Unknown opcode 252 (0xFC) in WASM`.

References: [WebAssembly Opcodes](https://pengowray.github.io/wasm-ops/).

## Thanks

- zkWasm Project: [DelphinusLab/zkWasm](https://github.com/DelphinusLab/zkWasm)
- The Graph AssemblyScript API Specification: [graphprotocol/graph-tooling](https://github.com/graphprotocol/graph-tooling)
- Polywrap BigInt Implementation: [polywrap/as-bigint](https://github.com/polywrap/as-bigint)
- Near Base58 Implementation: [near/as-base58](https://github.com/near/as-base58)
