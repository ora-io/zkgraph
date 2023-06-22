/**
 * Thows an error if the condition is not met.
 * Example: `require(1 == 2);` throws an error; `require(1 == 1);` does not.
 * In zkWASM, the definition is `void require(int cond);`
 * This function needs to be concatenated to the compiled .js file.
 */
export function require(condition) {
  if (!condition) throw new Error("require failed");
}
