import { readFileSync } from "fs";
import fs from "fs";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { config } from "../config.js";
import {
  logDivider,
  logLoadingAnimation,
  currentNpmScriptName,
} from "./common/utils.js";
import { zkwasm_setup } from "./requests/zkwasm_setup.js";
import {
  waitTaskStatus,
  taskPrettyPrint,
} from "./requests/zkwasm_taskdetails.js";
import path from "path";

let wasmPath;
let cirSz;
if (currentNpmScriptName() === "setup-local") {
  wasmPath = config.LocalWasmBinPath;
  cirSz = 20;
} else if (currentNpmScriptName() === "setup") {
  wasmPath = config.WasmBinPath;
  cirSz = 22;
}

// Message and form data
const name = path.basename(wasmPath); // only use in zkwasm, can diff from local files
const md5 = ZkWasmUtil.convertToMd5(readFileSync(wasmPath)).toUpperCase();
const image = fs.createReadStream(wasmPath);
const prikey = config.UserPrivateKey;
const description_url_encoded = "";
const avator_url = "";
const circuit_size = cirSz;

// Log script name
console.log(">> SET UP", "\n");

let [response, isSetUpSuccess, errorMessage] = await zkwasm_setup(
  name,
  md5,
  image,
  prikey,
  description_url_encoded,
  avator_url,
  circuit_size,
);

if (isSetUpSuccess) {
  console.log(`[+] IMAGE MD5: ${response.data.result.md5}`, "\n");

  console.log(
    `[+] SET UP TASK STARTED. TASK ID: ${response.data.result.id}`,
    "\n",
  );

  console.log("[*] Please wait for image set up... (estimated: 1-5 min)", "\n");

  const loading = logLoadingAnimation();

  let taskDetails;
  try {
    taskDetails = await waitTaskStatus(
      response.data.result.id,
      ["Done", "Fail"],
      3000,
      0,
    ); //TODO: timeout
  } catch (error) {
    loading.stopAndClear();
    console.error(error);
    process.exit(1);
  }

  loading.stopAndClear();

  const taskStatus = taskDetails.status === "Done" ? "SUCCESS" : "FAILED";

  console.log(
    `[${taskStatus === "SUCCESS" ? "+" : "-"}] SET UP ${taskStatus}`,
    "\n",
  );

  // Log extra new line before divider.
  console.log();

  taskPrettyPrint(taskDetails, "[*] ");

  logDivider();

  process.exit(0);
} else {
  console.log(`[*] IMAGE MD5: ${md5}`, "\n");

  // Log status
  console.log(`[-] ${errorMessage}`, "\n");

  logDivider();

  process.exit(1);
}
