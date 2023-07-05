import { fromHexString, toHexString } from "./utils.js";
export class HostMemory {
  constructor(max_size) {
    this.mem = new Uint8Array(max_size);
    this.writecur = 0;
    this.readcur = 0;
    this.view = new DataView(this.mem.buffer);
  }
  push(data, little_endian = true) {
    if (little_endian) {
      for (var i = 0; i < data.length; i++) {
        this.mem[this.writecur + i] = data[i];
      }
    } else {
      for (var i = 0; i < data.length; i++) {
        this.mem[this.writecur + data.length - 1 - i] = data[i];
      }
    }
    this.writecur += data.length;
  }
  push_align(data, little_endian = true) {
    var padlen = Math.ceil(data.length / 8) * 8 - data.length;
    this.push(data, little_endian);
    this.push(new Uint8Array(padlen));
  }
  write_once(data, type) {
    if (type == "i64") {
      this.push_align(data, false);
    } else if (type == "bytes-packed") {
      this.push_align(data, true);
    } else {
      throw Error(
        "zkwasm mock: data type (",
        type,
        ") not supported, please file an issue if you think it should be supported."
      );
    }
  }
  write_from_input(str) {
    var args = str.split(" ");
    for (var i in args) {
      if (args[i].length == 0) continue;
      var _arg = args[i].split(":");
      if (_arg.length > 2) throw Error("multiple ':' in \"" + args[i] + '"');
      var [d, t] = [_arg[0], _arg[1]];
      this.write_once(fromHexString(d), t);
    }
  }
  print(title = "") {
    console.log("---------------" + title + "---------------");
    console.log(">> total length: " + this.writecur);
    console.log(">> data: ");
    console.log(toHexString(this.mem.slice(0, this.writecur)));
    console.log("------------------------------" + "-".repeat(title.length));
  }
  read_i64() {
    this.readcur += 8;
    return this.view.getBigUint64(this.readcur - 8, true);
  }
}

// var mem = new HostMemory(100000000)
// mem.write_from_input('0x43d:i64 0x43d:i64 0x121212121212:bytes-packed')
// mem.print()
// console.log(mem.read_i64().toString(16))
// console.log(mem.read_i64().toString(16))
// console.log(mem.read_i64().toString(16))

export class ZKWASMMock {
  constructor(max_pri_size = 100000000, max_pub_size = 1000) {
    this.privateMem = new HostMemory(max_pri_size);
    this.publicMem = new HostMemory(max_pub_size);
  }

  set_private_input(str) {
    this.privateMem.write_from_input(str);
  }

  set_public_input(str) {
    this.publicMem.write_from_input(str);
  }

  static require(a) {
    if (!a) {
      console.log("[-] zkwasm require condition is false");
      throw Error("Abort execution");
      //TODO: change to graceful kill rather than throw Error?
    }
  }

  wasm_input(a) {
    if (a == 0) return this.privateMem.read_i64();
    else if (a == 1) return this.publicMem.read_i64();
    else throw Error("zkwasm mock: wasm_input is invalid: ", a);
  }
}
