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
import {Blob} from 'buffer';
import FormData from "form-data";
import { ZkWasmUtil } from "zkwasm-service-helper";
const compiledWasmBuffer = readFileSync("build/zkgraph_local.wasm");
const compiledWasmBlob = new Blob([compiledWasmBuffer]);


const md5 = ZkWasmUtil.convertToMd5(compiledWasmBuffer).toUpperCase();
            console.log("md5: ", md5)

let formData = new FormData();
            formData.append('name', "poc_module.wasm");
            formData.append('image_md5', md5);
            formData.append("image",compiledWasmBlob);
            formData.append("user_address", getState().entities.wallet.address.toLowerCase(),);
            formData.append("description_url", description_url_encoded);
            formData.append("avator_url", "https://www.hyperoracle.io/static/media/Hyper%20Oracle%20Logo_White.8d58b96fc82ce311ad7ea6bf614ef344.svg");
            formData.append("circuit_size", 18);
            formData.append("signature", signature);


let requestHeaders = new Headers();
requestHeaders.append("Accept", "application/json");

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

function post(endpoint, data) {
    console.log(data);
    return fetch(endpoint.url, {
        method: "POST",
        // @ts-ignore
        headers:{
            ...endpoint.contentType,
            Accept: "application/json",
            Authorization: null,
        },
        body: data,
    }).then((res) => {
        console.log("[POST]: ", res);
        return handleResponse(res, endpoint.url);
    });
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


// post(url.postNewWasmImage, formData).then(res => console.log)