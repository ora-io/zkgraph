# Customized ZKGraphs Running on ZKWASM

## Compile
```bash
asc main.ts --lib ./demo-uniswap-v2-idx-zkgraph -t main.wat -O --noAssert -o main.wasm --disable bulk-memory --use abort=sdk/zkwasm/abort --target release
```

## Notice

To running on zkwasm, do not use io syscalls like `console` etc.

To keep the wasm small, try not use keywords that may introcude extra global init code e.g. `new`, `static` etc. (`changetype` is fine)