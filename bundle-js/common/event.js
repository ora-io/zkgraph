import { fromHexString, toHexString } from "./utils.js";
export class Event {
  constructor(
    address,
    topics,
    data,
    address_offset,
    topics_offset,
    data_offset
  ) {
    this.address = address;
    this.topics = topics;
    this.data = data;
    this.address_offset = address_offset;
    this.topics_offset = topics_offset;
    this.data_offset = data_offset;
  }

  prettyPrint(prefix = "", withoffsets = true) {
    console.log(">>");
    console.log(
      prefix,
      "|--addr:",
      toHexString(this.address),
      withoffsets ? this.address_offset : ""
    );
    for (var j = 0; j < this.topics.length; j++) {
      console.log(
        prefix,
        "|--arg#",
        j.toString(),
        ": ",
        toHexString(this.topics[j]),
        withoffsets ? this.topics_offset[j] : ""
      );
    }
    console.log(
      prefix,
      "|--data:",
      toHexString(this.data),
      withoffsets ? this.data_offset : ""
    );
  }

  static fromRlp(rlpdata) {
    var address = rlpdata[0].data;
    var address_offset = rlpdata[0].dataIndexes;

    var topics = [];
    var topics_offset = [];
    for (var i = 0; i < rlpdata[1].data.length; i++) {
      topics.push(rlpdata[1].data[i].data);
      topics_offset.push(rlpdata[1].data[i].dataIndexes);
    }

    var data = rlpdata[2].data;
    var data_offset = rlpdata[2].dataIndexes;
    return new Event(
      address,
      topics,
      data,
      address_offset,
      topics_offset,
      data_offset
    );
  }
}

// var e = new Event(Uint8Array.from([0xa,0xb]),[Uint8Array.from([0xa,0xb]),Uint8Array.from([0xa,0xb])],Uint8Array.from([0xbe,0xef]))
// e.prettyPrint()
