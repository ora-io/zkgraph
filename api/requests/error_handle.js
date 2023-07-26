
export function handleAxiosError(error){
    let errMsg, isRetry=false // stop by default
    switch(error.code){
        case 'ENOTFOUND':
            errMsg = "Can't connect to " + error.hostname
            break
        case 'ERR_BAD_RESPONSE':
            errMsg = `ERR_BAD_RESPONSE: ${error.response.status} ${error.response.statusText}.`
            isRetry = true
            break
        case 'ERR_BAD_REQUEST':
            errMsg = `ERR_BAD_REQUEST: ${error.response.status} ${error.response.statusText}.`
            break
        default:
            switch(Math.floor(error.response.status / 100)){
                case 4:
                case 5:
                    errMsg = `HTTP ERROR: ${error.response.status} ${error.response.statusText}.`
                    break
                default:
                    errMsg = error
                    break
            }
            break
    }
    return [errMsg, isRetry]
}