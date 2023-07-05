import { fromHexString, toHexString } from "./utils.js";
export class HostMemory {
    constructor(max_size = 100000000){
        this.mem = new Uint8Array(max_size);
        this.writecur = 0;
        this.readcur = 0;
        this.view = new DataView(this.mem.buffer)
    }
    push(data, little_endian=true){
        if (little_endian){
            for (var i=0; i < data.length; i++){
                this.mem[this.writecur + i] = data[i]
            }
        }else{
            for (var i=0; i < data.length; i++){
                this.mem[this.writecur + data.length - 1 - i] = data[i]
            }
        }
        this.writecur += data.length
    }
    push_align(data, little_endian=true){
        var padlen = Math.ceil(data.length / 8) * 8 - data.length
        this.push(data, little_endian)
        this.push(new Uint8Array(padlen))
    }
  write_once(data,type){
    if (type == 'i64'){
        this.push_align(data, false)
    } else if (type == 'bytes-packed'){
        this.push_align(data, true)
    }
  }
  write_from_input(str){
    var args = str.split(' ')
    for(var i in args){
        if (args[i].length == 0) continue
        var _arg = args[i].split(':')
        if (_arg.length > 2) throw Error("multiple ':' in \""+args[i]+"\"")
        var [d,t] = [_arg[0], _arg[1]]
        this.write_once(fromHexString(d), t)

    }
  }
  print(){
    var rst = ''
    console.log(this.writecur)
    for (var i =0;i<20; i++){
        rst += this.mem[i].toString(16)
    }
    console.log(rst)
    // console.log(toHexString(this.mem.slice(0, this.writecur)))
  }
  read_i64() {
    this.readcur += 8;
    return(this.view.getBigUint64(this.readcur - 8, true))
    var tmp = this.view.getBigUint64(0, false)
    // console.log(tmp+1)
    console.log(this.view.getBigUint64(8, false))
    // console.log(view.getUint32(8, false))
    // var data = this.mem.slice(this.readcur-8, this.readcur);
    // return changetype<BigUint64Array>(data)[0];
  }
}

function require(a) {
  console.log("require1");
}
function wasm_input(a) {
  return true;
}

// var mem = new HostMemory()
// mem.write_from_input('0x43d:i64 0x43d:i64 0x121212121212:bytes-packed')
// mem.print()
// console.log(mem.read_i64().toString(16))
// console.log(mem.read_i64().toString(16))
// console.log(mem.read_i64().toString(16))