export class HostMemory {
    mem = new Uint8Array()
    cur = 0;
    read_i64 () {
        cur += 8;
        return mem[cur-8];
    }
}

function require(a){
    console.log('require1');
}
function wasm_input(a){
    return true;
}

async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      require(x) {
        // sdk/zkwasm/require1(i32) => i64
        require(x);
      },
      wasm_input(x) {
        // sdk/zkwasm/wasm_input(i32) => i64
        return wasm_input(x) || 0n;
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  return exports;
}
export const {
  memory,
  zkmain
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
  }
))(new URL("../../build/zkgraph.wasm", import.meta.url)); 
//TODO: demo_idx -> param
