import { readFileSync } from "fs";
import fs from "fs";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { config } from "../../config.js";
import { logDivider } from "../common/utils.js";
import { zkwasm_setup } from "../requests/zkwasm_setup.js";

const inputPathPrefix = "build/zkgraph_full";
const compiledWasmBuffer = readFileSync(inputPathPrefix + ".wasm");

// Message and form data
const name = "zkgraph_full.wasm";
const md5 = ZkWasmUtil.convertToMd5(compiledWasmBuffer).toUpperCase();
const image = fs.createReadStream(inputPathPrefix + ".wasm");
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

    console.log(`[+] TASK ID: ${response.data.result.id}`, "\n")

    console.log("[+] SET UP SUCCESSFULLY STARTED!", "\n");

    logDivider();

    process.exit(0);
  } else {
    console.log(`[*] IMAGE MD5: ${md5}`, "\n");
    // Log status
    console.log(`[-] ${errorMessage}`, "\n");

    logDivider();

    process.exit(1);
  }
