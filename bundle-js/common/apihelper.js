import { TxReceipt } from "./txreceipt.js"
import { trimPrefix, fromHexString } from "./utils.js"
import assert from 'assert';

function eventTo7Offsets(event, receiptBaseOffset){
    var rst = [event.address_offset[0] + receiptBaseOffset]
    
    for (var i = 0; i<4; i++){
        rst.push(i < event.topics.length ? event.topics_offset[i][0] + receiptBaseOffset : 0)
    }

    rst.push(event.data_offset[0] + receiptBaseOffset)
    rst.push(event.data.length)
    return rst
}

// function cleanReceipt(receipt){
//     var r = receipt
//     r = trimPrefix(r, '0x')
//     r = trimPrefix(r, '02')
//     return r
// }

var cleanReceipt = (r) => trimPrefix( trimPrefix(r, '0x'), '02' )

// export function rlpDecodeAndEventFilter(rawreceiptList, srcAddr, srcEsigs) {
//     var matched_offset_list = []
//     var accumulateReceiptLength = 0

//     var rawreceipts = ''

//     var events_list = []

//     for (var i in rawreceiptList) {
//         // concat matched_offset_list
//         var es = TxReceipt.fromRawStr(rawreceiptList[i]).filter(srcAddr, srcEsigs);
        
//         matched_offset_list = matched_offset_list.concat( ...es.map(e => eventTo7Offsets(e, accumulateReceiptLength)) )
        
//         // concat rawreceipts
//         // var r = ;
//         // r = trimPrefix(r, '0x')
//         // r = trimPrefix(r, '02')
//         var r = cleanReceipt(rawreceiptList[i])
//         rawreceipts += r
//         // console.log('for:', r)

//         accumulateReceiptLength += Math.ceil(r.length / 2)
//     }
//     return [fromHexString(rawreceipts), matched_offset_list]
// }


export function rlpDecodeAndEventFilter(rawreceiptList, srcAddr, srcEsigs) {

    var eventsList = []

    for (var i in rawreceiptList) {
        // concat matched_offset_list
        var es = TxReceipt.fromRawStr(rawreceiptList[i]).filter(srcAddr, srcEsigs);

        eventsList.push(es)
        
    }
    return eventsList
}


export function genStreamAndMatchedEventOffsets(rawreceiptList, eventList){
    var matched_offset_list = []
    var accumulateReceiptLength = 0

    var rawreceipts = ''
    assert(rawreceiptList.length == eventList.length)
    for (var rcpid in rawreceiptList){
        var es = eventList[rcpid]
        matched_offset_list = matched_offset_list.concat( ...es.map(e => eventTo7Offsets(e, accumulateReceiptLength)) )
                
        // concat rawreceipts
        // var r = ;
        // r = trimPrefix(r, '0x')
        // r = trimPrefix(r, '02')
        var r = cleanReceipt(rawreceiptList[rcpid])
        rawreceipts += r
        // console.log('for:', r)

        accumulateReceiptLength += Math.ceil(r.length / 2)
    }

    return [fromHexString(rawreceipts), matched_offset_list]
}