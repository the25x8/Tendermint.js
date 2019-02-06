// tslint:disable-next-line:export-just-namespace

export = TendermintJS;
export as namespace TendermintJS;

declare namespace TendermintJS {
	class EventBus {
		private events: {};
		constructor();
		public emit(eventName: string, payload: any): void;
		public on(eventName: string, callback: object, once: boolean = false): { off: object };
		public once(eventName: string, callback: object): void;
		public off(eventName: string): void;
	}

	export interface IValidatorVote {
		round: string;
		prevotes: string[];
		prevotes_bit_array: string;
		precommits: string[];
		precommits_bit_array: string;
	}

	export interface IValidators {
		proposer: IValidator;
		validators: IValidator[];
	}

	export default interface IValidator {
		voting_power: string;
		address: string;
		accum?: string;
		pub_key: {
			type: string;
			value: string;
		};
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
		block_id: IBlockID;
		signature: {
			data: string;
			type: string;
		};
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

	interface ITxResultTag {
		key: string;
		value: string;
	}

	interface ITx {
		proof: ITxProof;
		index: number;
		height: number;
		hash: string;
		tx: string;
		tx_result: ITxResult;
		result?: {
			tags?: ITxResultTag[];
		}
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
		validator_info: IValidator;
	}

	interface IGlobalOptions {
		node_rpc: string;
		node_ws: string;
		logs: boolean;
	}

	class SocketClient {
		isSynced: boolean;
		$events: EventBus;

		constructor(options: IGlobalOptions);

		connect(eventsTypes: string[] = []): Promise;
		action(
			method: 'subscribe'|'unsubscribe',
			type: 'blocks'|'txs'
		);
	}

	interface IAbciInfo {
		data: any;
		version: string;
		app_version: string;
	}

	interface IVoteSet {
		round: string;
		prevotes: string[];
		prevotes_bit_array: string;
		precommits: string[];
		precommits_bit_array: string;
	}

	interface IConsensusState {
		'height/round/step': string;
		start_time: string;
		proposal_block_hash: string;
		locked_block_hash: string;
		valid_block_hash: string;
		height_vote_set: IVoteSet[];
	}

	export interface IAbciInfo {
		data: any;
		version: string;
		app_version: string;
	}

	export interface IConsensusState {
		'height/round/step': string;
		start_time: string;
		proposal_block_hash: string;
		locked_block_hash: string;
		valid_block_hash: string;
		height_vote_set: IValidatorVote[];
	}

	export interface IDumpConsensusState {
		height: string;
		round: string;
		step: number;
		start_time: string;
		commit_time: string;
		validators: IValidators;
		proposal: any;
		proposal_block: any;
		proposal_block_parts: any;
		locked_round: string;
		locked_block: any;
		locked_block_parts: any;
		valid_round: string;
		valid_block: any;
		valid_block_parts: any;
		votes: IValidatorVote[];
		commit_round: string;
		last_commit: {
			votes: string[];
			votes_bit_array: string;
			peer_maj_23s: any;
		};
		last_validators: IValidators;
		peers: string[];
	}

	class RpcClient {
		constructor(options: IGlobalOptions);

		async abciInfo(): IAbciInfo;
		async consensusState(): IConsensusState;
		async dumpConsensusState(): IDumpConsensusState;
	}

	class BlockModel implements IBlock {
		last_commit: IBlockLastCommit;
		data: IBlockData;
		header: IBlockHeader;
		block_meta: IBlockMeta;

		constructor(rawModel: IBlock);
	}

	class TxModel {
		public proof: object;
		public tx: string;
		public tx_result: object;
		public index: number;
		public height: number;
		public hash: string;

		constructor(rawTx: ITx);
	}

	export default class TendermintJS {
		static createBlockModel: (rawBlock: IBlock) => BlockModel;
		static createTxModel: (rawTx: ITx) => TxModel;
		static eventBus: () => EventBus;

		socket: SocketClient;
		rpc: RpcClient;

		constructor(options: IGlobalOptions);

		test(): string;
	}
}
