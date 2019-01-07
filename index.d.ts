declare module 'tendermint-js-client' {
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

	export interface IClientOptions {
		node_rpc: string;
		node_ws: string;
		autoSyncToWs?: boolean;
	}

	export class BlockModel implements IBlock {
		last_commit: IBlockLastCommit;
		data: IBlockData;
		header: IBlockHeader;
		block_meta: IBlockMeta;

		constructor(rawModel: IBlock);
	}

	export class TxModel {
		constructor(rawTx: ITx);
	}

	export class TendermintClient {
		public status: IStatus;
		public events: any;
		public isSynced: boolean;

		constructor(options: IClientOptions);

		public connect(): void;
		public test(): string;
	}
}
