export function currentNpmScriptName() {
  return process.env.npm_lifecycle_event;
}

export function logDivider() {
  const line = "=".repeat(process.stdout.columns);
  console.log(line);
}
