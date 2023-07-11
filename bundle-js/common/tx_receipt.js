import { fromHexString, areEqualArrays } from "./utils.js";
import { Event } from "./event.js";

import RLP from "./rlp.js";

export class TxReceipt {
  constructor(status, gasUsed, logsBloom, events) {
    this.status = status;
    this.gasUsed = gasUsed;
    this.logsBloom = logsBloom;
    this.events = events;
  }

  static fromRawBin(rawReceipt) {
    /** EIP-2718 */
    if (rawReceipt[0] <= 2) {
      const txtype = rawReceipt[0]; // useless
      rawReceipt = rawReceipt.slice(1);
    }
    const rlpdata = RLP.decode(rawReceipt);
    const status = rlpdata[0].data;
    const gasUsed = rlpdata[1].data;
    const logsBloom = rlpdata[2].data;

    const rlpevents = rlpdata[3].data;
    const events = [];
    for (let i = 0; i < rlpevents.length; i++) {
      events.push(Event.fromRlp(rlpevents[i].data));
    }
    return new TxReceipt(status, gasUsed, logsBloom, events);
  }

  static fromRawStr(rawReceiptStr) {
    return TxReceipt.fromRawBin(fromHexString(rawReceiptStr));
  }

  toValidEvents() {
    if (this.status != 0x1) {
      // tx failed
      return [];
    } else {
      return this.events;
    }
  }

  filter(wanted_address, wanted_esigs) {
    const events = this.toValidEvents();
    const rst = [];
    for (let i = 0; i < events.length; i++) {
      if (areEqualArrays(events[i].address, wanted_address)) {
        let esig = events[i].topics[0];
        for (let j = 0; j < wanted_esigs.length; j++) {
          if (areEqualArrays(esig, wanted_esigs[j])) {
            rst.push(events[i]);
            break;
          }
        }
      }
    }
    return rst;
  }
}
