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