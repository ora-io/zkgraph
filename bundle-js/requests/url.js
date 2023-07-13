type EndPoint =  {
    url: string;
    isProtected: boolean;
    contentType?: {};
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
    sendToCompile: ():EndPoint => ({
        url: "http://node.hyperoracle.io:8000/uploadfile",
        isProtected: false,
    }),
    getEthStatus: (zkgid:string):EndPoint => ({
        url:`https://node.hyperoracle.io/graph?zkgid=${zkgid}`,
        isProtected: false,
    }),
    postNewWasmImage: ():EndPoint => ({
        url: `${baseUrl()}/setup`,
        isProtected: false,
    }),
    fetchConfiguredMD5: ():EndPoint => ({
        url: `${baseUrl()}/tasks?tasktype=Setup`,
        isProtected: false,
    }),
    checkWasmImageStatus:  (md5:string, taskType: string | null =null):EndPoint => ({
        url: `${baseUrl()}/tasks?md5=${md5}${taskType? "&tasktype="+taskType : ""}`,
        isProtected: false
    }),
    deployWasmImageURL: ():EndPoint => ({
        url: `${baseUrl()}/deploy`,
        isProtected: false,
        contentType: { "Content-Type":"application/json" },
    }),
    proveWasmImageURL: ():EndPoint => ({
        url: `${baseUrl()}/prove`,
        isProtected: false,
        contentType: { "Content-Type":"application/json" },
    }),
    searchImageURL: (md5:string,):EndPoint => ({
        url: `${baseUrl()}/image?md5=${md5}`,
        isProtected: false,
    }),
    getUserBalance: (address:string):EndPoint => ({
        url: `${baseUrl()}/user?user_address=${address}`,
        isProtected: false,
    }),
    sendTXHash: (address: string):EndPoint => ({
        url: `${baseUrl()}/pay`,
        isProtected: false,
        contentType: { "Content-Type":"application/json" },
    })
};