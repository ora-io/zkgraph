# Customized ZKGraphs Running on ZKWASM

## Compile
```bash
npm install
npm run compile
```

## Notice

To running on zkwasm, do not use io syscalls like `console` etc.

To keep the wasm small, try not use keywords that may introcude extra global init code e.g. `new`, `static` etc. (`changetype` is fine)