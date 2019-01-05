const { decode } = require('msgpack-lite');
const Observable = require('zen-observable');
const WS = require('ws');

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
	block_meta: IBlockMeta;
}

export interface IBlockEvent {
	last_commit: IBlockLastCommit;
	data: IBlockData;
	header: IBlockHeader;
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

export interface ITxEvent {}

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

/*
 * ----------------------
 * Common models
 */
export class BlockModel {
	constructor(rawBlock: IBlock) {

	}
}

export class TxModel {
	constructor(rawTx: ITx) {

	}
}

/*
 * Main class
 */
export class TendermintClient {
	public status: IStatus;
	public events: any;
	public isSynced: boolean;

	private isNode: boolean;
	private options: IClientOptions;
	private connection: any;

	constructor(options: IClientOptions) {
		this.options = options;
		this.isSynced = false;
		this.isNode = typeof window === 'undefined';
	}

	public connect(): void {
		this.events = new Observable((observable) => {
			const messageHandler = (event: any) => {
				if (this.isNode) {
					observable.next(event);
				} else {
					observable.next(JSON.parse(event.data));
				}
			};

			const openHandler = () => {
				this.isSynced = true;
				this.subscribeToBlocks();
				console.log('Connected to node web socket');
			};

			const closeHandler = (error) => {
				this.connection = null;
				this.isSynced = false;
				console.error('Error in web socket connection:', error);
			};

			const errorHandler = (error) => {
				console.error('Socket error:', error);
				observable.complete();
			};

			try {
				if (this.isNode) {
					this.connection = new WS(`${this.options.node_ws}/websocket`);

					this.connection.on('open', () => openHandler());
					this.connection.on('close', error => closeHandler(error));
					this.connection.on('error', error => errorHandler(error));
					this.connection.on('message', event => messageHandler(event));
				}
				// for browsers
				else {
					this.connection = new WebSocket(`${this.options.node_ws}/websocket`);

					this.connection.onopen = () => openHandler();
					this.connection.onclose = error => closeHandler(error);
					this.connection.onerror = error => errorHandler(error);
					this.connection.onmessage = event => messageHandler(event);
				}

			} catch (e) {
				console.error(`Error in web socket connection: ${e}`);
				observable.complete();
			}
		});
	}

	public subscribeToBlocks(): void {
		try {
			this.connection.send(JSON.stringify({
				id: 'explorer-sub-to-blocks',
				jsonrpc: '2.0',
				method: 'subscribe',
				params: {
					query: 'tm.event=\'NewBlock\'',
				},
			}));
		} catch (e) {
			console.error(e);
		}
	}

	public test() {
		return 'ok';
	}

}
