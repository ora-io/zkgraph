import axios from "axios";
import url from "./url.js";
import { handleAxiosError } from "./error_handle.js";

export async function zkwasm_taskdetails(taskId) {
  // let isSetUpSuccess = true;

  let requestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url: url.getTaskDetails(taskId).url,
    headers: {
      ...url.getTaskDetails().contentType,
    },
  };

  let errorMessage = null;
  const response = await axios.request(requestConfig).catch((error) => {
    // isSetUpSuccess = false;
    // console.log(error.message)

    // if (error.code == 'ENOTFOUND'){
    //     errorMessage = "Can't connect to " + error.hostname;
    // }else{
    //     console.log(error)
    //     errorMessage = error.code;
    // }
    errorMessage = error;
    // errorMessage = error.response.data;//todo: is this usefull?
  });
  return [response, errorMessage];
}

// TODO: timeout
export async function waitTaskStatus(
  taskId,
  statuslist,
  interval,
  timeout = 0,
) {
  // let done = false;
  // setInterval(() => {
  //     var [response, isSetUpSuccess, errorMessage] = await zkwasm_taskdetails(taskId)
  //     if(response.data.result.data[0].status == 'Done'){
  //         done = true
  //         return
  //     }
  // }, interval)
  // var [response, isSetUpSuccess, errorMessage] = await zkwasm_taskdetails(taskId)
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      var [response, error] = await zkwasm_taskdetails(taskId);

      if (error != null) {
        let [errMsg, isRetry] = handleAxiosError(error);
        if (isRetry) {
          console.log(errMsg, "Retry.");
          setTimeout(checkStatus, interval);
        } else {
          // stop
          reject(errMsg);
        }
      } else {
        const status = response.data.result.data[0].status; // Call function A to check data status
        var matched = false;
        for (var i in statuslist) {
          if (status == statuslist[i]) {
            matched = true;
            break;
          }
        }
        if (matched) {
          resolve(response.data.result.data[0]); // Resolve the promise when the status is matched
        } else {
          setTimeout(checkStatus, interval); // Call checkStatus function again after a 1-second delay
        }
      }
    };

    checkStatus(); // Start checking the data status
  });
}

function millToHumanReadable(mill) {
  let min = Math.floor(mill / 60000);
  let sec = (mill % 60000) / 1000;
  return `${min} min ${sec} sec`;
}

export function taskPrettyPrint(resData, prefix = "") {
  console.log(`${prefix}Task submit time: ${resData.submit_time}`);
  console.log(`${prefix}Process started: ${resData.process_started}`);
  console.log(`${prefix}Process finished: ${resData.process_finished}`);
  console.log(
    `${prefix}Pending time: ${millToHumanReadable(
      new Date(resData.process_started) - new Date(resData.submit_time),
    )}`,
  );
  console.log(
    `${prefix}Running time: ${millToHumanReadable(
      new Date(resData.process_finished) - new Date(resData.process_started),
    )}`,
  );
}

// try{
// let a = await waitTaskStatus('64c0c2bbf0e3eee93f75c260', ['Done', 'Fail'], 100);
// // console.log(a)
// taskPrettyPrint(a, '[*] ')
// }catch(error) {
//     console.log(error)
// }
// var [response, errorMessage] =await zkwasm_taskdetails('64c0c2bbf0e3eee93f75c260')
// console.log(response.data.result.data[0].status)
