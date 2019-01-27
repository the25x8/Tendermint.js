/*
 * -------------------
 * Transaction interfaces
 */
export interface ITxProof {
  Data: string;
  RootHash: string;
  Total: string;
  Index: string;
  Proof: {
    aunts: string[],
  };
}

export interface ITxResultTag {
  key: string;
  value: string;
}

export interface ITxResult {
  log?: string;
  data?: string;
  code?: string;
  tags?: ITxResultTag[];
}

// https://github.com/tendermint/tendermint/blob/master/rpc/core/tx.go#L37
export interface ITx {
  proof: ITxProof;
  index: number;
  height: number;
  hash: string;
  tx: string;
  tx_result: ITxResult;
  result?: {
    tags: ITxResultTag[];
  };
}
