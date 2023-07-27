export function handleAxiosError(error) {
  let errMsg,
    isRetry = false; // stop by default
  switch (error.code) {
    case "ENOTFOUND":
      errMsg = "Can't connect to " + error.hostname;
      break;
    case "ERR_BAD_RESPONSE":
      switch (error.response.status) {
        case 500:
          errMsg = error.response.data;
          break;
        case 502:
          isRetry = true;
        default:
          errMsg = `ERR_BAD_RESPONSE: ${error.response.status} ${error.response.statusText}.`;
          break;
      }
      break;
    case "ERR_BAD_REQUEST":
      errMsg = `ERR_BAD_REQUEST: ${error.response.status} ${error.response.statusText}.`;
      break;
    default:
      errMsg = `HTTP ERROR: ${error.response.status} ${error.response.statusText}.`;
      break;
  }
  return [errMsg, isRetry];
}
