import { fromHexString, areEqualArrays } from "./utils.js";
import { Event } from "./event.js";

// import RLP from 'rlp'
import RLP from "./rlp.js";

export function concatRawRlpList(rawrlplist) {
  var str = "";
  for (var i in rawrlplist) {
    var r = rawrlplist[i];
    if (r.startsWith("0x02")) {
      str += r.slice(4);
    } else if (r.startsWith("0x")) {
      str += r.slice(2);
    } else {
      console.log("---->", r);
    }
    if (i >= 2) {
      break;
    }
  }
  return fromHexString(str);
}

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
      var txtype = rawReceipt[0]; // useless
      rawReceipt = rawReceipt.slice(1);
    }
    var rlpdata = RLP.decode(rawReceipt);
    var status = rlpdata[0].data;
    var gasUsed = rlpdata[1].data;
    var logsBloom = rlpdata[2].data;

    console.log(rlpdata[1])
    var rlpevents = rlpdata[3].data;
    // console.log(rlpevents)
    var events = [];
    for (var i = 0; i < rlpevents.length; i++) {
      events.push(Event.fromRlp(rlpevents[i].data));
      events[events.length-1].prettyPrint()
    }
    return new TxReceipt(status, gasUsed, logsBloom, events);
  }

  static fromRawStr(rawReceiptStr) {
    return TxReceipt.fromRawBin(fromHexString(rawReceiptStr));
  }

  toValidEvents() {
    if (this.status != 0x1) { // tx failed
      return [];
    }else{
        return this.events;
    }
  }

  filter(wanted_address, wanted_esigs) {
    var events = this.toValidEvents();
    var rst = [];
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

// var rawreceipts = fromHexString(
//   "02f9043a0183046276b9010000200000000000000000000080000000000000000000000000010000000000000000000000000001000000000000000002040000080000000000040000000000000000000000000000000008000000200000080000000000000000008000000004000000000000000000000000000000000000000000000000000010000000000000000000000000004000000000000000000001000000080000004000000000000000004000000000000000020100000000000000000000000000020000000000000002000000080000000000000000000000000000001020000000000020000000200000000080000000000000000000000000000000400000000000000000f9032ff87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a0e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109ca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000000000000000000000000000016345785d8a0000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6a0000000000000000000000000000000000000000000000000016345785d8a0000f89b94d4cfb98837861216f1b51ca7368471c7a3d428abf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6a0000000000000000000000000b4645d3702f52f0a610e1616c5c07b81a085bfffa0000000000000000000000000000000000000000000001e9bf47b130a5af20ff5f87994c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b840000000000000000000000000000000000000000000000000e714ae4d320c454300000000000000000000000000000000000000000013d969429a7b93a3578f60f8fc94c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4645d3702f52f0a610e1616c5c07b81a085bfffb880000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e9bf47b130a5af20ff5"
// );
// var rawreceipts = fromHexString(
//     "02f9043a0183046276b9010000200000000000000000000080000000000000000000000000010000000000000000000000000001000000000000000002040000080000000000040000000000000000000000000000000008000000200000080000000000000000008000000004000000000000000000000000000000000000000000000000000010000000000000000000000000004000000000000000000001000000080000004000000000000000004000000000000000020100000000000000000000000000020000000000000002000000080000000000000000000000000000001020000000000020000000200000000080000000000000000000000000000000400000000000000000f9032ff87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a0e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109ca00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000000000000000000000000000016345785d8a0000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6a0000000000000000000000000000000000000000000000000016345785d8a0000f89b94d4cfb98837861216f1b51ca7368471c7a3d428abf863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6a0000000000000000000000000b4645d3702f52f0a610e1616c5c07b81a085bfffa0000000000000000000000000000000000000000000001e9bf47b130a5af20ff5f87994c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6e1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b840000000000000000000000000000000000000000000000000e714ae4d320c454300000000000000000000000000000000000000000013d969429a7b93a3578f60f8fc94c09fd65b483997d3a4b01e9e0f3c8560d0d91ff6f863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a00000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488da0000000000000000000000000b4645d3702f52f0a610e1616c5c07b81a085bfffb880000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e9bf47b130a5af20ff5"
//   );
// // var tr = TxReceipt.fromRaw(rawreceipts)
// // tr.events[0].prettyPrint()
// // var rawreceipts = fromHexString(
// //     "0xf90b9f01832b4bf1b9010000200010010002000000000080000000000000000000000000000000300000000000000000000000000000000000000006010000080000000000000000000000000000080000000000000008080000200000000000000000000000008020000000000000000000000000000000000000000000000020000000000010000200000000000000008000000000000000040000000001000000080000004200000000002010000000000000000000108000800000400000000008004000000000000001000012000000000000000000201000004800000400081000000000000000000000200001000000020000000000000000008000010000400000200000000000f90a94f9017a946131b5fae19ea4f9d964eac0408e4408b66337b5e1a04c39b7ce5f4f514f45cb6f82b171b8b0b7f2cbf488ad28e4eff451588e2f014bb90140000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000001b48eb57e00000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001ef87a94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f842a0e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109ca0000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1a000000000000000000000000000000000000000000000000000236ba984692000f89b94c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1a0000000000000000000000000a43fe16908251ee70ef74718545e4fe6c5ccec9fa000000000000000000000000000000000000000000000000000236ba984692000f89b946982508145454ce325ddbe47a25d4ec3d2311933f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000a43fe16908251ee70ef74718545e4fe6c5ccec9fa0000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1a00000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fbf87994a43fe16908251ee70ef74718545e4fe6c5ccec9fe1a01c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1b84000000000000000000000000000000000000000471e12f6e0b321757ddf4ff7d20000000000000000000000000000000000000000000000293655b501e33e1fd5f8fc94a43fe16908251ee70ef74718545e4fe6c5ccec9ff863a0d78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822a0000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1a0000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1b880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000236ba9846920000000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fb0000000000000000000000000000000000000000000000000000000000000000f89994555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1e1a0ddac40937f35385a34f721af292e5a83fc5b840f722bff57c2fc71adba708c48b860000000000000000000000000a43fe16908251ee70ef74718545e4fe6c5ccec9f0000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fb0000000000000000000000006982508145454ce325ddbe47a25d4ec3d2311933f89b946982508145454ce325ddbe47a25d4ec3d2311933f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa0000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1a00000000000000000000000006131b5fae19ea4f9d964eac0408e4408b66337b5a00000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fbf89b946982508145454ce325ddbe47a25d4ec3d2311933f863a0ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa00000000000000000000000006131b5fae19ea4f9d964eac0408e4408b66337b5a00000000000000000000000005667efe455e42b77d11450f7f03c13ae9e6de248a00000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fbf8f9946131b5fae19ea4f9d964eac0408e4408b66337b5e1a0d6d4f5681c246c9f42c203e287975af1601f8df8035a9251f79aab5c8f09e2f8b8c00000000000000000000000005667efe455e42b77d11450f7f03c13ae9e6de248000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000006982508145454ce325ddbe47a25d4ec3d23119330000000000000000000000005667efe455e42b77d11450f7f03c13ae9e6de24800000000000000000000000000000000000000000000000000236ba9846920000000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fbf899946131b5fae19ea4f9d964eac0408e4408b66337b5e1a0ddac40937f35385a34f721af292e5a83fc5b840f722bff57c2fc71adba708c48b860000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd10000000000000000000000000000000000000000003cf0c71a7fb02cda5ed3fb0000000000000000000000006982508145454ce325ddbe47a25d4ec3d2311933f9027a946131b5fae19ea4f9d964eac0408e4408b66337b5e1a0095e66fa4dd6a6f7b43fb8444a7bd0edb870508c7abf639bc216efb0bcff9779b90240000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001ed7b22536f75726365223a22646578746f6f6c73222c22416d6f756e74496e555344223a2231392e32333731222c22416d6f756e744f7574555344223a2231382e3930313433393637363130333335222c22526566657272616c223a22222c22466c616773223a332c22496e74656772697479496e666f223a7b224b65794944223a2231222c225369676e6174757265223a224b5552373173514563694f50426d6d4936496a75636e4c57596242696f36394b4156306e7a6144646b6f5848514a732f3955596c52463557576d6b3061554b636c6e4345665763674f52594a6e776468577a6a444c59576a316c4471795374636f3077394b754b3844454a584b494f31593855506b39474a506a374e7a324978662f784e6f306c31554834416d67374e377156652f324855447470507931372b2b5436547678305658656b6d5a4e72544c38684b79506146776e553272375638334b6f2f714e3337646a6d393956446b724d48737149325264545279365064464256616b6431685266536c6f666554794239774163682f5a57425a3065306756626a644d4441385344567357343548496c7a52714c6f666f68666a616d5a31674a594156647535426156755162532b494871412b615943566d70496654616c535a6d2b54334a722f43323735686e5a794269554e4d673d3d227d7d00000000000000000000000000000000000000"
// //   );
//   var tr = TxReceipt.fromRawBin(rawreceipts)
// var rst = tr.filter(
//   fromHexString("c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"),
//   [
//     fromHexString(
//       "e1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
//     ),
//   ])

//   console.log(rst)