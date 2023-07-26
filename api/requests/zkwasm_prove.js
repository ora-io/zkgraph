import axios from "axios";
import url from "./url.js";
import { Wallet } from "ethers";
import { computeAddress } from "ethers/lib/utils.js";
import { handleAxiosError } from "./error_handle.js";

export async function zkwasm_prove(
    user_privatekey,
    image_md5,
    public_inputs,
    private_inputs
    ){
    let isSetUpSuccess = true;

    const user_address = computeAddress(user_privatekey).toLowerCase();

    // let message = ZkWasmUtil.createProvingSignMessage({
    //   user_address: user_address,
    //   md5: image_md5,
    //   public_inputs: public_inputs,
    //   private_inputs: private_inputs,
    // });
    
    let message = JSON.stringify({
        user_address,
        md5: image_md5,
        public_inputs: public_inputs,
        private_inputs: private_inputs
    })
    const wallet = new Wallet(user_privatekey);
    let signature = await wallet.signMessage(message);

    // let formData = new FormData();
    // formData.append("user_address", user_address);
    // formData.append("md5", image_md5);
    // formData.append("public_inputs", public_inputs);
    // formData.append("private_inputs", private_inputs);
    // formData.append("signature", signature);
    const req = JSON.stringify({
        user_address,
        md5: image_md5,
        public_inputs: public_inputs,
        private_inputs: private_inputs,
        signature
    });
    let requestConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: url.proveWasmImageURL().url,
      headers: {
        ...url.proveWasmImageURL().contentType,
      },
      data: req,
    };

    let errorMessage = "";
    let _;
    const response = await axios.request(requestConfig).catch((error) => {
        [errorMessage, _] = handleAxiosError(error)
        isSetUpSuccess = false;
    });
    return [response, isSetUpSuccess, errorMessage]
}