import FormData from "form-data";
import axios from "axios";
import url from "./url.js";
import { Wallet } from "ethers";
import { ZkWasmUtil } from "zkwasm-service-helper";
import { computeAddress } from "ethers/lib/utils.js";
import { handleAxiosError } from "./error_handle.js";

export async function zkwasm_setup(
  name,
  image_md5,
  image,
  user_privatekey,
  description_url,
  avator_url,
  circuit_size,
) {
  let isSetUpSuccess = true;

  const user_address = computeAddress(user_privatekey).toLowerCase();

  let message = ZkWasmUtil.createAddImageSignMessage({
    name: name,
    image_md5: image_md5,
    image: image,
    user_address: user_address,
    description_url: description_url,
    avator_url: avator_url,
    circuit_size: circuit_size,
  });

  const wallet = new Wallet(user_privatekey);
  let signature = await wallet.signMessage(message);

  let formData = new FormData();
  formData.append("name", name);
  formData.append("image_md5", image_md5);
  formData.append("image", image);
  formData.append("user_address", user_address);
  formData.append("description_url", description_url);
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
  let _;
  const response = await axios.request(requestConfig).catch((error) => {
    [errorMessage, _] = handleAxiosError(error);
    if (errorMessage != "Error: Image already exists!") {
      console.log(error);
      console.log("Error in zkwasm_setup. Please retry.");
    }
    isSetUpSuccess = false;
    // errorMessage = error.response.data;
  });
  return [response, isSetUpSuccess, errorMessage];
}
