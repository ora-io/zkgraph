// import url from "../requests/url.js";


// import fs from fs

// fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });

import { readFileSync } from "fs";
import fs from "fs";
import {Blob} from 'buffer';
import FormData from "form-data";
import { ZkWasmUtil } from "zkwasm-service-helper";
import url from "../requests/url.js";
import axios from "axios";
const inputPathPrefix = "build/zkgraph_full";
const compiledWasmBuffer = readFileSync(inputPathPrefix + ".wasm");
// const compiledWasmBlob = new Blob([compiledWasmBuffer]);


const md5 = ZkWasmUtil.convertToMd5(compiledWasmBuffer).toUpperCase();
            console.log("md5: ", md5)

const userAddr = ""
const description_url_encoded = ""

let formData = new FormData();
            formData.append('name', "poc_module.wasm");
            formData.append('image_md5', md5);
            formData.append("image",fs.createReadStream(inputPathPrefix + ".wasm"));
            // formData.append("image",compiledWasmBlob);
            formData.append("user_address", userAddr);
            formData.append("description_url", description_url_encoded);
            formData.append("avator_url", "https://www.hyperoracle.io/static/media/Hyper%20Oracle%20Logo_White.8d58b96fc82ce311ad7ea6bf614ef344.svg");
            formData.append("circuit_size", 18);
            // formData.append("signature", signature);


// let requestHeaders = new Headers();
// requestHeaders.append("Accept", "application/json");

function get(endpoint){
    return fetch(endpoint.url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    }).then((res) => {
        // console.log("[GET]: ", res);
        return handleResponse(res, endpoint.url);
    });
}

// function post(endpoint, data) {
//     console.log(data);
//     return fetch(endpoint.url, {
//         method: "POST",
//         // @ts-ignore
//         headers:{
//             ...endpoint.contentType,
//             Accept: "application/json",
//             Authorization: null,
//         },
//         body: data,
//     }).then((res) => {
//         console.log("[POST]: ", res);
//         return handleResponse(res, endpoint.url);
//     });
// }


async function post (endpoint, data) {
    // console.log(data);
    // console.log('endpoint', endpoint);
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: endpoint.url,
        headers: {
          ...data.getHeaders(),
        //   Authorization: null,
        },
        data: data,
      };
      // Send request
    // return axios.request(config).then((res) => {
    //         console.log("[POST]: ", res);
    //         return handleResponse(res, endpoint.url);
    //     }).catch((error) => {
    //     });
    
        const res = await axios.request(config);
        return handleResponse(res)

//   console.log(response)
    // return fetch(endpoint.url, {
    //     method: "POST",
    //     // @ts-ignore
    //     headers:{
    //         ...endpoint.contentType,
    //         Accept: "application/json",
    //         Authorization: null,
    //     },
    //     body: data,
    // }).then((res) => {
    //     console.log("[POST]: ", res);
    //     return handleResponse(res, endpoint.url);
    // });
}

async function handleResponse(response, url){
    console.log("[url] ", url, response.status)
    if (200 === response.status) {
        let data = await response.json();
        return Promise.resolve(data);
    } else {
        console.error(`Request failed. URL= ${url}`);
        let data = await response.text();
        return Promise.reject({
            code: response.status,
            message: data ?? "Request failed due to your network error, please try later.",
            error: "Request failed due to your network error, please try later.",
        });
    }
}

export {get, post};


post(url.postNewWasmImage(), formData).then(res => console.log(res))