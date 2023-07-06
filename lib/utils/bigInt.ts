// Implementation for
// (https://github.com/graphprotocol/graph-tooling/blob/dcc246333397952506a9db6a6c556fc57b8017c2/packages/ts/common/numbers.ts#L6)
// For The Graph, they appear to be implemented in the node
// (https://github.com/graphprotocol/graph-node/blob/252e9129588b0b022bcaf50bbe365287db18241b/runtime/wasm/src/module/mod.rs#LL1551C18-L1551C18)
// Need optimization for zkWASM
// For this implementation, we use the `as-bigint` lib by Polywrap
// (https://github.com/polywrap/as-bigint)
import { BigInt } from "../common/type";
// TODO: Remove third-party dependency
import { BigInt as ASBigInt } from "../extlib/asBigInt";
import { bigIntToASBigInt } from "./conversion";

export function plus(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).add(bigIntToASBigInt(y)).toInt64());
}

export function minus(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).sub(bigIntToASBigInt(y)).toInt64());
}

export function times(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).mul(bigIntToASBigInt(y)).toInt64());
}

export function dividedBy(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).div(bigIntToASBigInt(y)).toInt64());
}

// export function dividedByDecimal(x: BigInt, y: BigDecimal): BigDecimal {
//   const numerator = x.toBigDecimal();
//   return numerator.div(y);
// }

export function mod(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).mod(bigIntToASBigInt(y)).toInt64());
}

export function pow(x: BigInt, exp: u8): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).pow(exp).toInt64());
}

export function fromString(s: string): BigInt {
  return BigInt.fromI64(ASBigInt.fromString(s).toInt64());
}

export function bitOr(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(
    bigIntToASBigInt(x).bitwiseOr(bigIntToASBigInt(y)).toInt64(),
  );
}

export function bitAnd(x: BigInt, y: BigInt): BigInt {
  return BigInt.fromI64(
    bigIntToASBigInt(x).bitwiseAnd(bigIntToASBigInt(y)).toInt64(),
  );
}

export function leftShift(x: BigInt, bits: u8): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).leftShift(bits).toInt64());
}

export function rightShift(x: BigInt, bits: u8): BigInt {
  return BigInt.fromI64(bigIntToASBigInt(x).rightShift(bits).toInt64());
}
