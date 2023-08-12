import axios from "axios";
import url from "./url.js";

export async function zkwasm_imagedetails(md5) {
  let requestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url: url.searchImageURL(md5).url,
    headers: {
      ...url.searchImageURL().contentType,
    },
  };

  let errorMessage = null;
  const response = await axios.request(requestConfig).catch((error) => {
    errorMessage = error;
  });
  return [response, errorMessage];
}
