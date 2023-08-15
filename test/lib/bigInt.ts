import { BigInt, ByteArray, Bytes } from "../../lib/common/type";
import { uint8ArrayToUint32Array } from "../../lib/utils/conversion";

export function testBigInt(): void {
  // fromString, toString
  let bigint = BigInt.fromString(I32.MAX_VALUE.toString());
  assert(
    bigint.toString() == I32.MAX_VALUE.toString(),
    "BigInt fromString and toString failed",
  );
  bigint = BigInt.fromString(
    "9999999999999999999999999999999999999999999999999",
  ); // definitely larger than I64.MAX_VALUE
  assert(
    bigint.toString() == "9999999999999999999999999999999999999999999999999",
    "BigInt big int failed",
  );
  bigint = BigInt.fromString(
    "-999999999999999999999999999999999999999999999999",
  ); // definitely smaller than I64.MIN_VALUE
  assert(
    bigint.toString() == "-999999999999999999999999999999999999999999999999",
    "BigInt small int failed",
  );

  // fromBytes, fromBytesBigEndian
  bigint = BigInt.fromBytes(ByteArray.fromI32(I32.MAX_VALUE));
  assert(
    bigint.toString() == I32.MAX_VALUE.toString(),
    "BigInt fromBytes (ByteArray) failed",
  );
  bigint = BigInt.fromBytes(ByteArray.fromI32(I32.MIN_VALUE), true);
  assert(
    bigint.toString() == I32.MIN_VALUE.toString(),
    "BigInt fromBytes (ByteArray negative) failed",
  );
  bigint = BigInt.fromBytes(Bytes.fromU32(U32.MAX_VALUE));
  assert(
    bigint.toString() == U32.MAX_VALUE.toString(),
    "BigInt fromBytes (Bytes) failed",
  );
  bigint = BigInt.fromBytesBigEndian(Bytes.fromU32(U32.MAX_VALUE));
  assert(
    bigint.toString() == U32.MAX_VALUE.toString(),
    "BigInt fromBytes (Bytes negative) failed",
  );

  // fromI32, toI32, fromU32, toU32
  bigint = BigInt.fromI32(I32.MAX_VALUE);
  assert(bigint.toI32() == I32.MAX_VALUE, "BigInt fromI32 and toI32 failed");
  bigint = BigInt.fromI32(I32.MIN_VALUE);
  assert(
    bigint.toI32() == I32.MIN_VALUE,
    "BigInt fromI32 and toI32 (negative) failed",
  );
  bigint = BigInt.fromU32(U32.MAX_VALUE);
  assert(bigint.toU32() == U32.MAX_VALUE, "BigInt fromU32 and toU32 failed");
  bigint = BigInt.fromU32(U32.MIN_VALUE);
  assert(
    bigint.toU32() == U32.MIN_VALUE,
    "BigInt fromU32 and toU32 (negative) failed",
  );

  // fromU64, toU64, fromI64, toI64
  bigint = BigInt.fromU64(U64.MAX_VALUE);
  assert(bigint.toU64() == U64.MAX_VALUE, "BigInt fromU64 and toU64 failed");
  bigint = BigInt.fromU64(U64.MIN_VALUE);
  assert(
    bigint.toU64() == U64.MIN_VALUE,
    "BigInt fromU64 and toU64 (negative) failed",
  );
  bigint = BigInt.fromI64(I64.MAX_VALUE);
  assert(bigint.toI64() == I64.MAX_VALUE, "BigInt fromI64 and toI64 failed");
  bigint = BigInt.fromI64(I64.MIN_VALUE);
  assert(
    bigint.toI64() == I64.MIN_VALUE,
    "BigInt fromI64 and toI64 (negative) failed",
  );

  // zero
  bigint = BigInt.zero();
  assert(bigint.toI32() == 0, "BigInt zero failed");

  // toHex, toHexString
  bigint = BigInt.fromI32(I32.MAX_VALUE);
  assert(bigint.toHex() == I32.MAX_VALUE.toString(16), "BigInt toHex failed");
  assert(
    bigint.toHexString() == I32.MAX_VALUE.toString(16),
    "BigInt toHexString failed",
  );
  assert(
    bigint.toHexString("0x") == "0x" + I32.MAX_VALUE.toString(16),
    "BigInt toHexString (with prefix) failed",
  );

  // isZero, isI32
  bigint = BigInt.fromI32(I32.MAX_VALUE);
  assert(!bigint.isZero(), "BigInt isZero failed");
  bigint = BigInt.zero();
  assert(bigint.isZero(), "BigInt isZero failed");
  bigint = BigInt.fromI32(I32.MAX_VALUE);
  assert(bigint.isI32(), "BigInt isI32 failed");
  bigint = BigInt.fromString(U32.MAX_VALUE.toString());
  assert(!bigint.isI32(), "BigInt isI32 failed");

  // plus, minus, times, div, mod, equals, notEqual, lt, le, gt, ge, neg
  // positive
  bigint = BigInt.fromString("18446744073709551616"); // 2^64 (U64.MAX_VALUE + 1)
  assert(
    bigint.plus(BigInt.fromString("1")).toString() == "18446744073709551617",
    "BigInt plus failed",
  );
  assert(
    bigint.minus(BigInt.fromString("1")).toString() == "18446744073709551615",
    "BigInt minus failed",
  );
  assert(
    bigint.times(BigInt.fromString("2")).toString() == "36893488147419103232",
    "BigInt times failed",
  );
  assert(
    bigint.div(BigInt.fromString("2")).toString() == "9223372036854775808",
    "BigInt div failed",
  );
  assert(
    bigint.mod(BigInt.fromString("2")).toString() == "0",
    "BigInt mod failed",
  );
  assert(
    bigint.equals(BigInt.fromString("18446744073709551616")),
    "BigInt equals failed",
  );
  assert(
    bigint.notEqual(BigInt.fromString("18446744073709551617")),
    "BigInt notEqual failed",
  );
  assert(
    bigint.lt(BigInt.fromString("18446744073709551617")),
    "BigInt lt failed",
  );
  assert(
    bigint.le(BigInt.fromString("18446744073709551617")),
    "BigInt le failed",
  );
  assert(
    bigint.gt(BigInt.fromString("18446744073709551615")),
    "BigInt gt failed",
  );
  assert(
    bigint.ge(BigInt.fromString("18446744073709551615")),
    "BigInt ge failed",
  );
  assert(
    bigint.neg().toString() == "-18446744073709551616",
    "BigInt neg failed",
  );
  // negative
  bigint = BigInt.fromString("-9223372036854775809"); // -2^63 - 1 (I64.MIN_VALUE - 1)
  assert(
    bigint.plus(BigInt.fromString("1")).toString() == "-9223372036854775808",
    "BigInt plus failed",
  );
  assert(
    bigint.minus(BigInt.fromString("1")).toString() == "-9223372036854775810",
    "BigInt minus failed",
  );
  assert(
    bigint.times(BigInt.fromString("2")).toString() == "-18446744073709551618",
    "BigInt times failed",
  );
  assert(
    bigint.div(BigInt.fromString("2")).toString() == "-4611686018427387904",
    "BigInt div failed",
  );
  assert(
    bigint.mod(BigInt.fromString("2")).toString() == "-1",
    "BigInt mod failed",
  );
  assert(
    bigint.equals(BigInt.fromString("-9223372036854775809")),
    "BigInt equals failed",
  );
  assert(
    bigint.notEqual(BigInt.fromString("-9223372036854775808")),
    "BigInt notEqual failed",
  );
  assert(
    bigint.lt(BigInt.fromString("-9223372036854775808")),
    "BigInt lt failed",
  );
  assert(
    bigint.le(BigInt.fromString("-9223372036854775808")),
    "BigInt le failed",
  );
  assert(
    bigint.gt(BigInt.fromString("-9223372036854775810")),
    "BigInt gt failed",
  );
  assert(
    bigint.ge(BigInt.fromString("-9223372036854775810")),
    "BigInt ge failed",
  );
  assert(bigint.neg().toString() == "9223372036854775809", "BigInt neg failed");

  // abs, pow, sqrt, bitOr, bitAnd, leftShift, rightShift
  // positive
  bigint = BigInt.fromString("18446744073709551616"); // 2^64 (U64.MAX_VALUE + 1)
  assert(
    bigint.abs().toString() == "18446744073709551616",
    "BigInt abs failed",
  );
  assert(
    bigint.pow(2).toString() == "340282366920938463463374607431768211456",
    "BigInt pow failed",
  );
  assert(bigint.sqrt().toString() == "4294967296", "BigInt sqrt failed");
  assert(
    bigint.bitOr(BigInt.fromString("1")).toString() == "18446744073709551617",
    "BigInt bitOr failed",
  );
  assert(
    bigint.bitAnd(BigInt.fromString("1")).toString() == "0",
    "BigInt bitAnd failed",
  );
  assert(
    bigint.leftShift(1).toString() == "36893488147419103232",
    "BigInt leftShift failed",
  );
  assert(
    bigint.rightShift(1).toString() == "9223372036854775808",
    "BigInt rightShift failed",
  );
  // negative
  bigint = BigInt.fromString("-9223372036854775809"); // -2^63 - 1 (I64.MIN_VALUE - 1)
  assert(bigint.abs().toString() == "9223372036854775809", "BigInt abs failed");
  assert(
    bigint.pow(2).toString() == "85070591730234615884290395931651604481",
    "BigInt pow failed",
  );
  assert(
    bigint.bitOr(BigInt.fromString("1")).toString() == "-9223372036854775809",
    "BigInt bitOr failed",
  );
  assert(
    bigint.bitAnd(BigInt.fromString("1")).toString() == "1",
    "BigInt bitAnd failed",
  );
  assert(
    bigint.leftShift(1).toString() == "-18446744073709551618",
    "BigInt leftShift failed",
  );
  assert(
    bigint.rightShift(1).toString() == "-4611686018427387905",
    "BigInt rightShift failed",
  );

  // copy, bitNot, bitXor, isNegative, isOdd
  bigint = BigInt.fromString("18446744073709551616"); // 2^64 (U64.MAX_VALUE + 1)
  assert(
    bigint.copy().toString() == "18446744073709551616",
    "BigInt copy failed",
  );
  assert(
    bigint.bitNot().toString() == "-18446744073709551617",
    "BigInt bitNot failed",
  );
  assert(
    bigint.bitXor(BigInt.fromString("1")).toString() == "18446744073709551617",
    "BigInt bitXor failed",
  );
  assert(!bigint.isNegative, "BigInt isNegative failed");
  assert(!bigint.isOdd(), "BigInt isOdd failed");
  assert(
    bigint.square().toString() == "340282366920938463463374607431768211456",
    "BigInt square failed",
  );

  console.log("✅ Test BigInt");
}
