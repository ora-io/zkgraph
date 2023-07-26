// zkWASM friendly and Subgraph equivalent AssemblyScript API for zkGraph:
// (https://thegraph.com/docs/en/developing/assemblyscript-api/)
// Reference Implementation:
// (https://github.com/graphprotocol/graph-tooling/tree/main/packages/ts)

// class BigInt
export * from "./types/bigInt";
// class Event
export * from "./types/event";
// class ByteArray, Bytes, Address
export { ByteArray, Bytes, Address } from "./types/bytes";

// used in asc to rm env.abort
function abort(a: usize, b: usize, c: u32, d: u32): void {}
