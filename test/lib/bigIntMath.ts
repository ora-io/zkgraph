import { BigInt } from "../../lib/common/type";

export function testBigIntMath(): void {
  // plus()
  let a = BigInt.fromString("12");
  let b = BigInt.fromString("34");
  let result = a.plus(b);
  assert(result.toString() === "46", "Failed: plus()");

  a = BigInt.fromString("-1");
  b = BigInt.fromString("-2");
  result = a.plus(b);
  assert(result.toString() === "-3", "Failed: plus()");

  a = BigInt.fromString("999999");
  b = BigInt.fromString("1");
  result = a.plus(b);
  assert(result.toString() === "1000000", "Failed: plus()");

  a = BigInt.fromString("1");
  b = BigInt.fromString("999999");
  result = a.plus(b);
  assert(result.toString() === "1000000", "Failed: plus()");

  // minus()
  a = BigInt.fromString("50");
  b = BigInt.fromString("25");
  result = a.minus(b);
  assert(result.toString() === "25", "Failed: minus()");

  a = BigInt.fromString("25");
  b = BigInt.fromString("50");
  result = a.minus(b);
  assert(result.toString() === "-25", "Failed: minus()");

  a = BigInt.fromString("50");
  b = BigInt.fromString("-25");
  result = a.minus(b);
  assert(result.toString() === "75", "Failed: minus()");

  a = BigInt.fromString("-25");
  b = BigInt.fromString("50");
  result = a.minus(b);
  assert(result.toString() === "-75", "Failed: minus()");

  a = BigInt.fromString("999999");
  b = BigInt.fromString("1");
  result = a.minus(b);
  assert(result.toString() === "999998", "Failed: minus()");

  a = BigInt.fromString("1");
  b = BigInt.fromString("999999");
  result = a.minus(b);
  assert(result.toString() === "-999998", "Failed: minus()");

  // times()
  a = BigInt.fromString("5");
  b = BigInt.fromString("10");
  result = a.times(b);
  assert(
    result.toString() === BigInt.fromString("50").toString(),
    "Failed: times()",
  );

  a = BigInt.fromString("-5");
  b = BigInt.fromString("10");
  result = a.times(b);
  assert(
    result.toString() === BigInt.fromString("-50").toString(),
    "Failed: times()",
  );

  a = BigInt.fromString("-5");
  b = BigInt.fromString("-10");
  result = a.times(b);
  assert(
    result.toString() === BigInt.fromString("50").toString(),
    "Failed: times()",
  );

  a = BigInt.fromString("1");
  b = BigInt.fromString("999999");
  result = a.times(b);
  assert(
    result.toString() === BigInt.fromString("999999").toString(),
    "Failed: times()",
  );

  a = BigInt.fromString("999999");
  b = BigInt.fromString("1");
  result = a.times(b);
  assert(
    result.toString() === BigInt.fromString("999999").toString(),
    "Failed: times()",
  );

  // div()
  a = BigInt.fromString("100");
  b = BigInt.fromString("5");
  result = a.div(b);
  assert(
    result.toString() === BigInt.fromString("20").toString(),
    "Failed: div()",
  );

  a = BigInt.fromString("-100");
  b = BigInt.fromString("7");
  result = a.div(b);
  assert(
    result.toString() === BigInt.fromString("-14").toString(),
    "Failed: div()",
  );

  a = BigInt.fromString("100");
  b = BigInt.fromString("-7");
  result = a.div(b);
  assert(
    result.toString() === BigInt.fromString("-14").toString(),
    "Failed: div()",
  );

  a = BigInt.fromString("-100");
  b = BigInt.fromString("-7");
  result = a.div(b);
  assert(
    result.toString() === BigInt.fromString("14").toString(),
    "Failed: div()",
  );

  a = BigInt.fromString("999999");
  b = BigInt.fromString("1");
  result = a.div(b);
  assert(
    result.toString() === BigInt.fromString("999999").toString(),
    "Failed: div()",
  );

  a = BigInt.fromString("1");
  b = BigInt.fromString("999999");
  result = a.div(b);
  assert(
    result.toString() === BigInt.fromString("0").toString(),
    "Failed: div()",
  );

  // mod()
  a = BigInt.fromString("100");
  b = BigInt.fromString("7");
  result = a.mod(b);
  assert(
    result.toString() === BigInt.fromString("2").toString(),
    "Failed: mod()",
  );

  a = BigInt.fromString("-100");
  b = BigInt.fromString("7");
  result = a.mod(b);
  assert(
    result.toString() === BigInt.fromString("-2").toString(),
    "Failed: mod()",
  );

  a = BigInt.fromString("100");
  b = BigInt.fromString("-7");
  result = a.mod(b);
  assert(
    result.toString() === BigInt.fromString("2").toString(),
    "Failed: mod()",
  );

  a = BigInt.fromString("-100");
  b = BigInt.fromString("-7");
  result = a.mod(b);
  assert(
    result.toString() === BigInt.fromString("-2").toString(),
    "Failed: mod()",
  );

  a = BigInt.fromString("999999");
  b = BigInt.fromString("1");
  result = a.mod(b);
  assert(
    result.toString() === BigInt.fromString("0").toString(),
    "Failed: mod()",
  );

  a = BigInt.fromString("1");
  b = BigInt.fromString("999999");
  result = a.mod(b);
  assert(
    result.toString() === BigInt.fromString("1").toString(),
    "Failed: mod()",
  );

  // equals()
  a = BigInt.fromString("10");
  b = BigInt.fromString("10");
  assert(a.equals(b), "Failed: equals()");

  a = BigInt.fromString("10");
  b = BigInt.fromString("5");
  assert(!a.equals(b), "Failed: equals()");

  // notEqual()
  a = BigInt.fromString("5");
  b = BigInt.fromString("10");
  assert(a.notEqual(b), "Failed: notEqual()");

  a = BigInt.fromString("10");
  b = BigInt.fromString("10");
  assert(!a.notEqual(b), "Failed: notEqual()");

  // neg()
  a = BigInt.fromString("5");
  result = a.neg();
  assert(
    result.toString() === BigInt.fromString("-5").toString(),
    "Failed: neg()",
  );

  a = BigInt.fromString("-5");
  result = a.neg();
  assert(
    result.toString() === BigInt.fromString("5").toString(),
    "Failed: neg()",
  );

  a = BigInt.fromString("0");
  result = a.neg();
  assert(
    result.toString() === BigInt.fromString("0").toString(),
    "Failed: neg()",
  );

  // bitOr()
  a = BigInt.fromString("15");
  b = BigInt.fromString("7");
  result = a.bitOr(b);
  assert(result.toString() === "15", "Failed: bitOr()");

  // bitAnd()
  a = BigInt.fromString("15");
  b = BigInt.fromString("7");
  result = a.bitAnd(b);
  assert(result.toString() === "7", "Failed: bitAnd()");

  // leftShift()
  a = BigInt.fromString("10");
  result = a.leftShift(2);
  assert(result.toString() === "40", "Failed: leftShift()");

  // rightShift()
  a = BigInt.fromString("10");
  result = a.rightShift(2);
  assert(result.toString() === "2", "Failed: rightShift()");

  // pow()
  a = BigInt.fromString("2");
  result = a.pow(3);
  assert(result.toString() === "8", "Failed: pow()");
  console.log("✅ Test BigIntMath");
}
