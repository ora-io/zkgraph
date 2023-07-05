import { fromHexString, toHexString } from "./utils.js";
export class Event{
    
    constructor(address, topics, data){
        this.address = address;
        this.topics = topics;
        this.data = data;
    }

    prettyPrint(prefix='') {
        console.log(prefix, '|--addr:', toHexString(this.address));
        for (var j=0; j<this.topics.length; j++){
            console.log(prefix, '|--arg#', j.toString(), ': ', toHexString(this.topics[j]));
        }
        console.log(prefix, '|--data:', toHexString(this.data));
    }


    static fromRlp(rlpdata){
        var address = rlpdata[0].data;
        var topics = rlpdata[1].data;
        var data = rlpdata[2].data;
        return new Event(address, topics, data);
    }
}

// var e = new Event(Uint8Array.from([0xa,0xb]),[Uint8Array.from([0xa,0xb]),Uint8Array.from([0xa,0xb])],Uint8Array.from([0xbe,0xef]))
// e.prettyPrint()