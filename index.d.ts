// tslint:disable-next-line:export-just-namespace
export = TendermintJS;
export as namespace TendermintJS;

declare namespace TendermintJS {
	class Observable {
		subscribe(observer: any): any;
		forEach(fn: any): void;
		map(fn: any): any;
		filter(fn: any): any;
		reduce(fn: any): any;
	}

	interface IBlockID {
		hash: string;
		parts: {
			hash: string;
			total: string;
		};
	}

	interface IBlockPrecommit {
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

	interface IBlockLastCommit {
		precommits: IBlockPrecommit[];
		blockID: IBlockID;
	}

	interface IBlockData {
		txs: string[];
	}

	interface IBlockHeader {
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

	interface IBlockMeta {
		header: IBlockHeader;
		block_id: IBlockID;
	}

	interface IBlock {
		last_commit: IBlockLastCommit;
		data: IBlockData;
		header: IBlockHeader;
		block_meta?: IBlockMeta;
	}

	interface ITxProof {
		Data: string;
		RootHash: string;
		Total: string;
		Index: string;
		Proof: {
			aunts: string[],
		};
	}

	interface ITxResult {
		log?: string;
		data?: string;
		code?: string;
	}

	interface ITx {
		proof: ITxProof;
		index: string;
		height: string;
		hash: string;
		tx: string;
		tx_result: ITxResult;
	}

	interface IStatusValidatorInfo {
		voting_power: string;
		address: string;
		pub_key: {
			type: string;
			value: string;
		};
	}

	interface IStatusSyncInfo {
		latest_block_hash: string;
		latest_app_hash: string;
		latest_block_height: string;
		latest_block_time: string;
		catching_up: boolean;
	}

	interface IStatusNodeInfo {
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

	interface IStatus {
		node_info: IStatusNodeInfo;
		sync_info: IStatusSyncInfo;
		validator_info: IStatusValidatorInfo;
	}

	interface IClientOptions {
		node_rpc: string;
		node_ws: string;
		logs: boolean;
	}

	interface ISocketClient {
		isSynced: boolean;
		$events: Observable;

		constructor(options: IClientOptions);

		connect(eventsTypes: string[]): Promise;
	}

	class BlockModel implements IBlock {
		last_commit: IBlockLastCommit;
		data: IBlockData;
		header: IBlockHeader;
		block_meta: IBlockMeta;

		constructor(rawModel: IBlock);
	}

	class TxModel {
		constructor(rawTx: ITx);
	}

	export default class TendermintJS {
		status: IStatus;
		socket: ISocketClient;
		rpc: any;

		constructor(options: IClientOptions);

		test(): string;
	}
}
