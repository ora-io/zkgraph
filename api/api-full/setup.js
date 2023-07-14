import { readFileSync } from "fs";
import fs from "fs";
import FormData from "form-data";
import { ZkWasmUtil } from "zkwasm-service-helper";
import axios from "axios";
import url from "../requests/url.js";
import { config } from "../../config.js";
import { Wallet } from "ethers";
import { computeAddress } from "ethers/lib/utils.js";
import { logDivider } from "../common/utils.js";

const inputPathPrefix = "build/zkgraph_full";
const compiledWasmBuffer = readFileSync(inputPathPrefix + ".wasm");

// Message and form data
const name = "zkgraph_full.wasm";
const md5 = ZkWasmUtil.convertToMd5(compiledWasmBuffer).toUpperCase();
const image = fs.createReadStream(inputPathPrefix + ".wasm");
const address = computeAddress(config.UserPrivateKey).toLowerCase();
const description_url_encoded = "";
const avator_url = "";
const circuit_size = 22;

// Log script name
console.log(">> SET UP", "\n");
let isSetUpSuccess = true;

let message = ZkWasmUtil.createAddImageSignMessage({
  name: name,
  image_md5: md5,
  image: image,
  user_address: address,
  description_url: description_url_encoded,
  avator_url: avator_url,
  circuit_size: circuit_size,
});
const wallet = new Wallet(config.UserPrivateKey);
let signature = await wallet.signMessage(message);

let formData = new FormData();
formData.append("name", name);
formData.append("image_md5", md5);
formData.append("image", image);
formData.append("user_address", address);
formData.append("description_url", description_url_encoded);
formData.append("avator_url", avator_url);
formData.append("circuit_size", circuit_size);
formData.append("signature", signature);

let requestConfig = {
  method: "post",
  maxBodyLength: Infinity,
  url: url.postNewWasmImage().url,
  headers: {
    ...formData.getHeaders(),
  },
  data: formData,
};

let errorMessage = "";
const response = await axios.request(requestConfig).catch((error) => {
    isSetUpSuccess = false;
    errorMessage = error.response.data;
});

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
