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

export interface ITxResult {
  log?: string;
  data?: string;
  code?: string;
}

// https://github.com/tendermint/tendermint/blob/master/rpc/core/tx.go#L37
export interface ITx {
  proof: ITxProof;
  index: string;
  height: string;
  hash: string;
  tx: string;
  tx_result: ITxResult;
}
