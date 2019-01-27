const { decode } = require('msgpack-lite');
const Buffer = require('buffer/').Buffer;

import { ITx, ITxProof, ITxResult } from '../interfaces/tx';

export class TxModel implements ITx {
  public proof: ITxProof;
  public tx: string;
  public tx: string;
  public tx_result: ITxResult;
  public index: number;
  public height: number;
  public hash: string;

  // Additional props
  public tx_decoded: string;
  public result: { tags: object } = { tags: null };

  constructor(rawTx: ITx) {
    this.proof = rawTx.proof;
    this.tx = rawTx.tx;
    this.tx_decoded = decode(Buffer.from(rawTx.tx, 'base64'));
    this.tx_result = rawTx.tx_result || rawTx.result;
    this.index = rawTx.index;
    this.height = rawTx.height;
    this.hash = rawTx.hash;

    if (this.tx_result.tags) {
      this.result.tags = this.tx_result.tags.reduce(
        (memo, group) => {
          memo[atob(group.key)] = group.value ? atob(group.value) : null;
          return memo;
        }, {});
    }
  }
}
