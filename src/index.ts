// const { decode } = require('msgpack-lite');
const Observable = require('zen-observable');
const WS = require('ws');

// import { TxModel } from './models/tx';
import { BlockModel } from './models/block';
import { IStatus } from './interfaces/status';

export interface IClientOptions {
	node_rpc: string;
	node_ws: string;
	autoSyncToWs?: boolean;
}

export class TendermintClientWS {
	private connection: any; // Ws connection
	private options: IClientOptions;
	readonly isNode = false;

	public isSynced: boolean;
	public $eventsSubscription: any; // Observer events

	constructor(globalProps: object) {
		this.isSynced = false;
		this.isNode = typeof window === 'undefined';
		this.options = globalProps.options;
	}

	/*
	 * RPC methods
	 */


	/*
	 * Connect to node via web socket
	 * subscribe to NewBlocks, NewTxs(optional)
	 * emit data through observable pattern
	 */
	public connect(): void {
		this.$eventsSubscription = new Observable((observable) => {
			/*
			 * WebSocket events handlers
			 */
			const messageHandler = (event: any) => {
				// Differences formats of ws class for node and browser
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
				console.log('Connected to node web socket');
				this.subscribe('blocks');
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
	private subscribe(to: string): void {
		try {
			if (to === 'blocks') {
				this.connection.send(JSON.stringify({
					id: 'explorer-sub-to-blocks',
					jsonrpc: '2.0',
					method: 'subscribe',
					params: {
						query: 'tm.event=\'NewBlock\'',
					},
				}));
			}
		} catch (e) {
			console.error(e);
		}
	}
}

/*
 * Main class
 */
export class TendermintClient extends TendermintClientWS<object> {
	private options: IClientOptions;

	public status: IStatus; // Last sync node status

	constructor(options: IClientOptions) {
		super({ options });
		this.options = options;
	}

	public test() {
		return 'ok';
	}

}
