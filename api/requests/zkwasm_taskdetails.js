import axios from "axios";
import url from "./url.js";

export async function zkwasm_taskdetails(
    taskId
    ){
    let isSetUpSuccess = true;

    let requestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: url.getTaskDetails(taskId).url,
      headers: {
        ...url.getTaskDetails().contentType,
      },
    };

    let errorMessage = "";
    const response = await axios.request(requestConfig).catch((error) => {
        isSetUpSuccess = false;
        errorMessage = error.response.data;
    });
    return [response, isSetUpSuccess, errorMessage]
}

export async function waitTaskStatus(taskId, statuslist, interval, timeout=0){
    // let done = false;
    // setInterval(() => {
    //     var [response, isSetUpSuccess, errorMessage] = await zkwasm_taskdetails(taskId)
    //     if(response.data.result.data[0].status == 'Done'){
    //         done = true
    //         return
    //     }
    // }, interval)
    // var [response, isSetUpSuccess, errorMessage] = await zkwasm_taskdetails(taskId)
        return new Promise((resolve) => {
            const checkStatus = async () => {
            var [response, isSetUpSuccess, errorMessage] = await zkwasm_taskdetails(taskId)
            const status = response.data.result.data[0].status; // Call function A to check data status
            var matched=false
            for (var i in statuslist){
                if (status == statuslist[i]) {
                    matched = true
                    break
                }
            }
            if (matched){
                resolve(status); // Resolve the promise when the status is 'done'
            }else{
                setTimeout(checkStatus, interval); // Call checkStatus function again after a 1-second delay
            }
          }
      
          checkStatus(); // Start checking the data status
        });
}
// let a = await waitTaskStatus('64b10bf0f0e3eee93f6e4e99', ['Done'], 1000);
// console.log(a)
// var [response, isSetUpSuccess, errorMessage] =await zkwasm_taskdetails('64b10bf0f0e3eee93f6e4e99')
// console.log(response.data.result.data[0].status)