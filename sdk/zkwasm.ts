import { Test2 } from "./lib/asBigInt.ts";

// used in asc to rm env.abort
function abort(a:usize, b:usize, c:u32, d:u32):void{}

// @ts-ignore
@external("env", "wasm_input")
declare function wasm_input(x: i32): i64

// @ts-ignore
@external("env", "require")
export declare function require(x: i32): void

export function wasm_private_input(): i64
{
  return wasm_input(0);
}

export function wasm_public_input(): i64
{
  return wasm_input(1);
}