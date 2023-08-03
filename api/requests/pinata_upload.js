import url from "./url.js";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { handleAxiosError } from "./error_handle.js";
import { computeAddress } from "ethers/lib/utils.js";
import { config } from "../../config.js";

export async function pinata_upload(
  user_privatekey,
  wasmPath,
  mappingPath,
  yamlPath,
  zkGraphName
) {
  let isUploadSuccess = true;

  const userAddress = computeAddress(user_privatekey).toLowerCase();

  const directoryName = `${zkGraphName} - ${userAddress}`;

  const mappingFile = fs.createReadStream(mappingPath);
  const wasmFile = fs.createReadStream(wasmPath);
  const yamlFile = fs.createReadStream(yamlPath);

  const formData = new FormData();
  formData.append("file", mappingFile, {
    filepath: `${directoryName}/mapping.ts`,
  });
  formData.append("file", wasmFile, {
    filepath: `${directoryName}/zkgraph.wasm`,
  });
  formData.append("file", yamlFile, {
    filepath: `${directoryName}/zkgraph.yaml`,
  });

  const metadata = JSON.stringify({
    name: directoryName,
  });
  formData.append("pinataMetadata", metadata);

  let requestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: url.uploadToPinata().url,
    headers: {
      Authorization: `Bearer ${config.PinataJWT}`,
      ...formData.getHeaders(),
    },
    data: formData,
  };

  let errorMessage = "";
  let _;
  const response = await axios.request(requestConfig).catch((error) => {
    [errorMessage, _] = handleAxiosError(error);
    isUploadSuccess = false;
  });

  return [response, isUploadSuccess, errorMessage];
}
