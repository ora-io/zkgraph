import { Bytes } from "./bytes";
export class Event {
  constructor(
    public address: Bytes,
    public esig: Bytes,
    public topic1: Bytes,
    public topic2: Bytes,
    public topic3: Bytes,
    public data: Bytes,
  ) {}
}
