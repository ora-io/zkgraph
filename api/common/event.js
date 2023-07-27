import { fromHexString, toHexString } from "./utils.js";
export class Event {
  constructor(
    address,
    topics,
    data,
    address_offset,
    topics_offset,
    data_offset,
  ) {
    this.address = address;
    this.topics = topics;
    this.data = data;
    this.address_offset = address_offset;
    this.topics_offset = topics_offset;
    this.data_offset = data_offset;
  }

  prettyPrint(prefix = "", withoffsets = true) {
    console.log(
      prefix,
      "|--addr :",
      toHexString(this.address),
      withoffsets ? this.address_offset : "",
    );
    for (let j = 0; j < this.topics.length; j++) {
      console.log(
        prefix,
        "|--arg#" + j.toString() + ": " + toHexString(this.topics[j]),
        withoffsets ? this.topics_offset[j] : "",
      );
    }
    console.log(
      prefix,
      "|--data :",
      toHexString(this.data),
      withoffsets ? this.data_offset : "",
    );
    console.log("");
  }

  static fromRlp(rlpdata) {
    const address = rlpdata[0].data;
    const address_offset = rlpdata[0].dataIndexes;

    const topics = [];
    const topics_offset = [];
    for (let i = 0; i < rlpdata[1].data.length; i++) {
      topics.push(rlpdata[1].data[i].data);
      topics_offset.push(rlpdata[1].data[i].dataIndexes);
    }

    const data = rlpdata[2].data;
    const data_offset = rlpdata[2].dataIndexes;

    return new Event(
      address,
      topics,
      data,
      address_offset,
      topics_offset,
      data_offset,
    );
  }
}
