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
2. Look at WASM cost for each operation! Complexer logic (eg. anything with lots of `if` or `string`) usally means more instructions, which means longer proof generation time.

## SDK Dev Tips

1. Don't use `I8.parseInt` because it will be compiled to `i32.extend8_s (aka. Unknown opcode 192 (0xC0) in WASM)`.
2. Don't use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).
