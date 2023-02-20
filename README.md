# Customized ZKGraphs Running on ZKWASM

## Compile
```bash
asc main.ts --lib ./uniswap-idx-zkgraph -t main.wat -O --noAssert -o main.wasm --disable bulk-memory --use abort=sdk/zkwasm/abort --target release
```
