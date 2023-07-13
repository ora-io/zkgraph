class EndPoint {
    constructor(url,
    isProtected,
    contentType){
        this.url=url//: string;
        this.isProtected=isProtected//: boolean;
        this.contentType=contentType//?: {};}
    }
}

// export const baseUrl = () => {
//     let env = process.env.REACT_APP_ENV;
//     if (env === "production") {
//         return process.env.REACT_APP_PROD_BASE;
//     } else if (env === "development") {
//         return process.env.REACT_APP_DEV_BASE;
//     }
// };

export const baseUrl = () => 'https://zkwasm-explorer.delphinuslab.com:8090'

export default {
    sendToCompile: () => new EndPoint(
         "http://node.hyperoracle.io:8000/uploadfile",
         false,
    ),
    getEthStatus: (zkgid) => new EndPoint(
        `https://node.hyperoracle.io/graph?zkgid=${zkgid}`,
         false,
    ),
    postNewWasmImage: () => new EndPoint(
         `${baseUrl()}/setup`,
         false,
    ),
    fetchConfiguredMD5: () => new EndPoint(
         `${baseUrl()}/tasks?tasktype=Setup`,
         false,
    ),
    checkWasmImageStatus:  (md5, taskType=null) => new EndPoint(
         `${baseUrl()}/tasks?md5=${md5}${taskType? "&tasktype="+taskType : ""}`,
         false
    ),
    deployWasmImageURL: () => new EndPoint(
         `${baseUrl()}/deploy`,
         false,
         { "Content-Type":"application/json" },
    ),
    proveWasmImageURL: () => new EndPoint(
         `${baseUrl()}/prove`,
         false,
         { "Content-Type":"application/json" },
    ),
    searchImageURL: (md5,) => new EndPoint(
         `${baseUrl()}/image?md5=${md5}`,
         false,
    ),
    getUserBalance: (address) => new EndPoint(
         `${baseUrl()}/user?user_address=${address}`,
         false,
    ),
    sendTXHash: (address) => new EndPoint(
         `${baseUrl()}/pay`,
         false,
         { "Content-Type":"application/json" },
    )
};