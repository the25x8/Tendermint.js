const { decode } = require('msgpack-lite');
const Buffer = require('buffer/').Buffer;

import {
  IBlock,
  IBlockData,
  IBlockHeader,
  IBlockLastCommit,
  IBlockMeta,
} from '../interfaces/block';

export class BlockModel implements IBlock {
  public last_commit: IBlockLastCommit;
  public data: IBlockData;
  public header: IBlockHeader;
  public block_meta: IBlockMeta;

  // Additional props
  public txs: any[] = [];

  constructor(rawBlock: IBlock) {
    this.last_commit = rawBlock.last_commit;
    this.block_meta = rawBlock.block_meta;
    this.header = rawBlock.header;
    this.data = rawBlock.data;

    if (rawBlock.data.txs) {
      this.txs = rawBlock.data.txs.map(
        (txBytes) => decode(Buffer.from(txBytes, 'base64')),
      );
    }
  }
}
