# Customized ZKGraphs Running on ZKWASM

## Compile
```bash
asc main.ts --lib ./uniswap-idx-zkgraph -t main.wat -O --noAssert -o main.wasm --disable bulk-memory --use abort=sdk/zkwasm/abort --target release
```

## Notice
to running on zkwasm, don't use io syscalls like `console` etc.
to keep the wasm small, try not use keywords that may introcude extra global init code e.g. `new`, `static` etc. (changetype is fine)