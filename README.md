# Customized ZKGraphs Running on ZKWASM

## Compile

Compilation will be based on main.ts, and generate `main.wasm` and `main.wat` in `build` folder.

```bash
npm install
npm run compile
```

## Notice

To running on zkwasm, do not use io syscalls like `console` etc.

To keep the wasm output small (for shorter proof generation time), try not use keywords that may introcude extra global init code e.g. `new`, `static` etc. (`changetype` is fine)

## zkGraph Dev Tips

1. Provable program needs to be compilable and runnable in normal execution runtime first.
2. Look at (approximate) WASM cost for each operation! Complexer logic (eg. anything with lots of `if` or `string`) usally means more instructions, which means longer proof generation time.
3. You may need to use `BigEndian` version functions for Ethereum data structures.

## SDK Dev Tips

1. Don't use `I8.parseInt` because it will be compiled to `i32.extend8_s (aka. Unknown opcode 192 (0xC0) in WASM)`.
2. Don't use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).

## Thanks

- zkWasm Project: [DelphinusLab/zkWasm](https://github.com/DelphinusLab/zkWasm)
- The Graph AssemblyScript API Specification: [graphprotocol/graph-tooling](https://github.com/graphprotocol/graph-tooling)
- Polywrap BigInt Implementation: [polywrap/as-bigint](https://github.com/polywrap/as-bigint)
- Near Base58 Implementation: [near/as-base58](https://github.com/near/as-base58)
