/*
 * Block interfaces
 */
export interface IBlockID {
  hash: string;
  parts: {
    hash: string;
    total: string;
  };
}

export interface IBlockPrecommit {
  type: string;
  round: string;
  height: string;
  validator_index: string;
  validator_address: string;
  signature: {
    data: string;
    type: string;
  };
  block_id: IBlockID;
}

export interface IBlockLastCommit {
  precommits: IBlockPrecommit[];
  blockID: IBlockID;
}

export interface IBlockData {
  txs: string[];
}

export interface IBlockHeader {
  app_hash: string;
  chain_id: string;
  height: string;
  time: string;
  num_txs: string;
  last_block_id: IBlockID;
  last_commit_hash: string;
  data_hash: string;
  validators_hash: string;
}

export interface IBlockMeta {
  header: IBlockHeader;
  block_id: IBlockID;
}

// https://github.com/tendermint/tendermint/blob/master/rpc/core/blocks.go#L145
export interface IBlock {
  last_commit: IBlockLastCommit;
  data: IBlockData;
  header: IBlockHeader;
  block_meta?: IBlockMeta;
}
