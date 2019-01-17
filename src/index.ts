// const { decode } = require('msgpack-lite');
const Observable = require('zen-observable');
const WS = require('ws');

// import { TxModel } from './models/tx';
import { BlockModel } from './models/block';
import { IStatus } from './interfaces/status';

//
export interface IClientOptions {
	node_rpc: string;
	node_ws: string;
}


/*
 * TM RPC methods
 */
export class TendermintRPC {
	constructor() {}
}

/*
 * TM web-socket logic
 */
export class TendermintWebSocket {
	private connection: any; // Ws connection
	private options: IClientOptions; // Global options
	readonly isNode = false;

	// Web-socket sync status
	public isSynced = false;

	// Observer events, only subscription
	// all data should parse and save on your client
	public $socketEventsSubscription: any;

	constructor(options: IClientOptions) {
		this.isNode = typeof window === 'undefined';
		this.options = options;
	}

	/*
	 * Connect to node via web socket
	 * subscribe to NewBlocks, NewTxs(optional)
	 * emit data through observable pattern
	 */
	public connect(options: {
		subscribeTo: string[]
	}): void {
		if (!this.options.node_ws) {
			console.error('You need set node_ws property in connect method arguments');
			return;
		}

		this.$socketEventsSubscription = new Observable((observable) => {
			/*
			 * WebSocket events handlers
			 */
			// Socket events/messages handler
			const messageHandler = (event: any) => {
				// Differences formats of ws class for node and browser
				const parsedEvent = this.isNode ? JSON.parse(event) : JSON.parse(event.data);
				const eventData = parsedEvent.result.data;

				if (!eventData) {
					observable.next(parsedEvent);
					return;
				}

				// If data is block
				if (eventData.type === 'tendermint/event/NewBlock') {
					observable.next(new BlockModel(eventData.value.block));
				}
				// If data is tx
				else if (eventData.type === 'tendermint/event/NewTx') {
					observable.next(new BlockModel(eventData.value));
				}
			};

			// when socket opened
			const openHandler = () => {
				this.isSynced = true;
				console.log('Connected to node web socket');

				// Handle subscribe keys
				options.subscribeTo.forEach((key: string) => {
					this.subscribe(key);
				});
			};

			// when socket closed
			const closeHandler = (error) => {
				this.connection = null;
				this.isSynced = false;
				console.error('Error in web socket connection:', error);
				observable.complete();
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
	 * Subscribe to Tendermint node via websocket
	 */
	private subscribe(to: string): void {
		try {
			let methodParams: {
				id: string;
				query: string;
			};

			if (to === 'blocks') {
				methodParams = {
					id:  'explorer-sub-to-blocks',
					query: 'tm.event=\'NewBlock\''
				};
			}

			this.connection.send(JSON.stringify({
				id: methodParams.id,
				jsonrpc: '2.0',
				method: 'subscribe',
				params: { query: methodParams.query },
			}));
		} catch (e) {
			console.error(e);
		}
	}
}

/*
 * Main class
 */
export class TendermintClient<IClientOptions> extends TendermintWebSocket<IClientOptions>, TendermintRPC {
	private options: IClientOptions;

	// Last sync node status
	public status: IStatus;

	constructor(options: IClientOptions) {
		super(options);
		this.options = options;
	}

	public test() {
		return 'ok';
	}

}
