/*
 * Status interfaces
 */
export interface IStatusValidatorInfo {
  voting_power: string;
  address: string;
  pub_key: {
    type: string;
    value: string;
  };
}

export interface IStatusSyncInfo {
  latest_block_hash: string;
  latest_app_hash: string;
  latest_block_height: string;
  latest_block_time: string;
  catching_up: boolean;
}

// https://github.com/tendermint/tendermint/blob/master/rpc/core/status.go#L38
export interface IStatusNodeInfo {
  id: string;
  listen_addr: string;
  network: string;
  version: string;
  channels: string;
  moniker: string;
  other: {
    tx_index: string;
    rpc_addr: string;
  };
  protocol_version: {
    p2p: string;
    block: string;
    app: string;
  };
}

export interface IStatus {
  node_info: IStatusNodeInfo;
  sync_info: IStatusSyncInfo;
  validator_info: IStatusValidatorInfo;
}
