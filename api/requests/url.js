import { config } from "../../config.js";

class EndPoint {
  constructor(url, isProtected, contentType) {
    this.url = url; //: string;
    this.isProtected = isProtected; //: boolean;
    this.contentType = contentType; //?: {};}
  }
}

export default {
  postNewWasmImage: () =>
    new EndPoint(`${config.ZkwasmProviderUrl}/setup`, false),
  fetchConfiguredMD5: () =>
    new EndPoint(`${config.ZkwasmProviderUrl}/tasks?tasktype=Setup`, false),
  checkWasmImageStatus: (md5, taskType = null) =>
    new EndPoint(
      `${config.ZkwasmProviderUrl}/tasks?md5=${md5}${
        taskType ? "&tasktype=" + taskType : ""
      }`,
      false,
    ),
  deployWasmImageURL: () =>
    new EndPoint(`${config.ZkwasmProviderUrl}/deploy`, false, {
      "Content-Type": "application/json",
    }),
  proveWasmImageURL: () =>
    new EndPoint(`${config.ZkwasmProviderUrl}/prove`, false, {
      "Content-Type": "application/json",
    }),
  getTaskDetails: (taskId) =>
    new EndPoint(`${config.ZkwasmProviderUrl}/tasks?id=${taskId}`, false, {
      "Content-Type": "application/json",
    }),
  searchImageURL: (md5) =>
    new EndPoint(`${config.ZkwasmProviderUrl}/image?md5=${md5}`, false),
  getUserBalance: (address) =>
    new EndPoint(
      `${config.ZkwasmProviderUrl}/user?user_address=${address}`,
      false,
    ),
  sendTXHash: (address) =>
    new EndPoint(`${config.ZkwasmProviderUrl}/pay`, false, {
      "Content-Type": "application/json",
    }),
};
