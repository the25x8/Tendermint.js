// const { decode } = require('msgpack-lite');
import { IClientOptions } from './index';

const Observable = require('zen-observable');
const WS = require('ws');

import { BlockModel } from './models/block';

/*
 * TM web-socket class
 */
export class SocketClient {
	private options: IClientOptions; // Global options
	private connection: any; // Ws connection

	readonly isNode = false;
	public isSynced = false;

	// Observer events, only subscription
	// all data should parse and save on your client
	public $events: any;

	constructor(options: IClientOptions) {
		this.isNode = typeof window === 'undefined';
		this.options = options;
	}

	/*
	 * Connect to node via web socket
	 * subscribe to NewBlocks, NewTxs(optional)
	 * emit data through observable pattern
	 */
	public connect(eventsTypes: string[]): Promise {
		return new Promise((resolve, reject) => {
			if (!this.options.node_ws) {
				console.error('You need set node_ws property in connect method arguments');
				reject();
			}

			/*
		 * Create an observable object with
		 * socket instance and event handlers
		 */
			this.$events = new Observable((observable) => {

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

					if (this.options.logs) {
						console.info('Connected to node web socket');
					}

					// Subscribe to ws events
					eventsTypes.forEach(eventType => this.subscribe(eventType));

					resolve();
				};

				// when socket closed
				const closeHandler = (error) => {
					this.connection = null;
					this.isSynced = false;

					console.error('TendermintWebSocket/Errors: Error in web socket connection:', error);
					observable.complete();
					reject();
				};

				const errorHandler = (error) => {
					console.error('TendermintWebSocket/Errors: Socket error:', error);
					observable.complete();
					reject();
				};

				/*
				 * Use different realisations to call
				 * of WebSockets for browser and node
				 */
				try {
					const wsUrl = `${this.options.node_ws}/websocket`;

					// for node
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
					console.error(`TendermintWebSocket/Errors: Error in web socket connection: ${e}`);
					observable.complete();
					reject();
				}
			});
		})
	}

	private unsubscribe(): void {

	}

	/*
	 * Subscribe to Tendermint node via websocket
	 */
	private subscribe(to: string): boolean {
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
			} else if (to === 'txs') {
				methodParams = {
					id:  'explorer-sub-to-txs',
					query: 'tm.event=\'NewTx\''
				};
			}
			// If to arg is not detected
			else { return }

			this.connection.send(JSON.stringify({
				id: methodParams.id,
				jsonrpc: '2.0',
				method: 'subscribe',
				params: { query: methodParams.query },
			}));

			return true;
		} catch (e) {
			console.error(e);
			return;
		}
	}
}