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
