import FormData from "form-data";
import axios from "axios";
import url from "./url.js";
import { Wallet } from "ethers";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { computeAddress } from "ethers/lib/utils.js";
import { handleAxiosError } from "./error_handle.js";
import { testNets } from "../common/constants.js";

// Deploy verification contract
export async function zkwasm_deploy(chain_id, user_privatekey, image_md5) {
  let isDeploySuccess = true;

  const address = computeAddress(user_privatekey).toLowerCase();
  const wallet = new Wallet(user_privatekey);

  const message = JSON.stringify({
    user_address: address,
    md5: image_md5,
    chain_id: chain_id,
  });
  const signature = await wallet.signMessage(message);

  const requestData = JSON.stringify({
    user_address: address,
    md5: image_md5,
    chain_id: chain_id,
    signature,
  });

  let requestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: url.deployWasmImageURL().url,
    data: requestData,
    headers: {
      "Content-Type": url.deployWasmImageURL().contentType["Content-Type"],
    },
  };

  let errorMessage = "";
  let _;
  const response = await axios.request(requestConfig).catch((error) => {
    [errorMessage, _] = handleAxiosError(error);
    isDeploySuccess = false;
  });
  return [response, isDeploySuccess, errorMessage];
}

export async function get_deployed(image_md5) {
  let requestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url: url.searchImageURL(image_md5).url
  };

  let errorMessage = null;
  const response = await axios.request(requestConfig).catch((error) => {
    errorMessage = error;
  });
  return [response, errorMessage];
}
