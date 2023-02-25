export async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      wasm_input(x) {
        // demo/wasm_input(i32) => i64
        return wasm_input(x) || 0n;
      },
      require(x) {
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    handleEvent(esig, topic1, topic2, topic3, data) {
      // demo/handleEvent(~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array) => ~lib/typedarray/Uint8Array
      esig = __retain(__lowerTypedArray(Uint8Array, 5, 0, esig) || __notnull());
      topic1 = __retain(__lowerTypedArray(Uint8Array, 5, 0, topic1) || __notnull());
      topic2 = __retain(__lowerTypedArray(Uint8Array, 5, 0, topic2) || __notnull());
      topic3 = __retain(__lowerTypedArray(Uint8Array, 5, 0, topic3) || __notnull());
      data = __lowerTypedArray(Uint8Array, 5, 0, data) || __notnull();
      try {
        return __liftTypedArray(Uint8Array, exports.handleEvent(esig, topic1, topic2, topic3, data) >>> 0);
      } finally {
        __release(esig);
        __release(topic1);
        __release(topic2);
        __release(topic3);
      }
    },
    read_bytes_from_u64_to_dst(dst, byte_length) {
      // demo/read_bytes_from_u64_to_dst(demo/Bytes, i32) => demo/Bytes
      dst = __lowerTypedArray(Bytes, 4, 0, dst) || __notnull();
      return __liftTypedArray(Bytes, exports.read_bytes_from_u64_to_dst(dst, byte_length) >>> 0);
    },
    read_bytes_from_u64(byte_length) {
      // demo/read_bytes_from_u64(i32) => demo/Bytes
      return __liftTypedArray(Bytes, exports.read_bytes_from_u64(byte_length) >>> 0);
    },
    read_len_then_bytes() {
      // demo/read_len_then_bytes() => demo/Bytes
      return __liftTypedArray(Bytes, exports.read_len_then_bytes() >>> 0);
    },
  }, exports);
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    return new constructor(
      memory.buffer,
      __getU32(pointer + 4),
      __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
    ).slice();
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__new(12, id) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  return adaptedExports;
}
