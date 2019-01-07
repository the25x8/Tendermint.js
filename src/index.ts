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

/*
 * ----------------------
 * Common models
 */
export class BlockModel implements IBlock {
	last_commit: IBlockLastCommit;
	data: IBlockData;
	header: IBlockHeader;
	block_meta: IBlockMeta;

	constructor(rawBlock: IBlock) {
		this.last_commit = rawBlock.last_commit;
		this.block_meta = rawBlock.block_meta;
		this.header = rawBlock.header;
		this.data = rawBlock.data;
	}
}

export class TxModel {
	constructor(rawTx: ITx) {}
}

/*
 * Main class
 */
export class TendermintClient {
	public status: IStatus; // Last sync node status
	public events: any; // Observer events
	public isSynced: boolean;

	readonly isNode: boolean; // Select platform
	private connection: any; // Ws connection
	private options: IClientOptions;

	constructor(options: IClientOptions) {
		this.options = options;
		this.isSynced = false;
		this.isNode = typeof window === 'undefined';
	}

	/*
	 * Connect to node via web socket
	 * subscribe to NewBlocks, NewTxs(optional)
	 * emit data through observable pattern
	 */
	public connect(): void {
		this.events = new Observable((observable) => {
			/*
			 * WebSocket events handlers
			 */
			const messageHandler = (event: any) => {
				// In browser ws event is json
				const parsedEvent = this.isNode ? JSON.parse(event) : JSON.parse(event.data);
				const eventData = parsedEvent.result.data;

				if (eventData) {
					// Block
					if (eventData.type === 'tendermint/event/NewBlock') {
						observable.next(new BlockModel(eventData.value.block));
					}
					// Transaction
					else if (eventData.type === 'tendermint/event/NewTx') {
						observable.next(new BlockModel(eventData.value));
					}
				} else {
					observable.next(parsedEvent);
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

			/*
			 * Use different realisations to call
			 * of WebSockets for browser and node
			 */
			try {
				const wsUrl = `${this.options.node_ws}/websocket`;

				// for nodejs
				if (this.isNode) {
					this.connection = new WS(wsUrl);

					this.connection.on('open', () => openHandler());
					this.connection.on('close', error => closeHandler(error));
					this.connection.on('error', error => errorHandler(error));
					this.connection.on('message', event => messageHandler(event));
				}
				// for browsers
				else {
					this.connection = new WebSocket(wsUrl);

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

	/*
	 * Static commands for ws
	 * of Tendermint node
	 */
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
