import { readFileSync } from "fs";
import fs from "fs";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { config } from "../config.js";
import { logDivider, logLoadingAnimation } from "./common/utils.js";
import { zkwasm_setup } from "./requests/zkwasm_setup.js";
import { waitTaskStatus } from "./requests/zkwasm_taskdetails.js";
import path from "path";

const wasmPath = config.WasmBinPath
const compiledWasmBuffer = readFileSync(wasmPath);

// Message and form data
const name = path.basename(config.WasmBinPath); // only use in zkwasm, can diff from local files
const md5 = ZkWasmUtil.convertToMd5(compiledWasmBuffer).toUpperCase();
const image = fs.createReadStream(wasmPath);
const prikey = config.UserPrivateKey
const description_url_encoded = "";
const avator_url = "";
const circuit_size = 22;

// Log script name
console.log(">> SET UP", "\n");

let [response, isSetUpSuccess, errorMessage] = await zkwasm_setup(name, md5, image,
    prikey,
    description_url_encoded,
    avator_url,
    circuit_size)

if (isSetUpSuccess) {
    console.log(`[+] IMAGE MD5: ${response.data.result.md5}`, "\n");

    console.log(`[+] SET UP TASK STARTED. TASK ID: ${response.data.result.id}`, "\n");

    console.log("[*] Please wait for image set up... (estimated: 1-5 min)", "\n");

    const loading = logLoadingAnimation();

    const taskResult = await waitTaskStatus(response.data.result.id, ['Done', 'Fail'], 2000, 0); //TODO: timeout

    if (taskResult === "Done" || taskResult === "Fail") {
      loading.stopAndClear();
    }

    const taskStatus = (taskResult === "Done") ? "SUCCESS" : "FAILED"

    console.log(`[${taskStatus === "SUCCESS" ? "+" : "-"}] SET UP ${taskStatus}`, "\n");

    logDivider();

    process.exit(0);
  } else {
    console.log(`[*] IMAGE MD5: ${md5}`, "\n");

    // Log status
    console.log(`[-] ${errorMessage}`, "\n");

    logDivider();

    process.exit(1);
  }
