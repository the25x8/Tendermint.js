const WS = require('ws');

import { IGlobalOptions } from './index';
import { BlockModel } from './models/block';
import { TxModel } from './models/tx';
import EventBus from './utils/eventBus';

/*
 * Tendermint websocket client
 */
export class SocketClient {

  public readonly isNode = false;
  public isSynced = false;

  // Observer events, only subscription
  // all data should parse and save on your client
  public $events: EventBus;
  private options: IGlobalOptions; // Global options
  private connection: any; // Ws connection

  constructor(options: IGlobalOptions) {
    this.isNode = typeof window === 'undefined';
    this.options = options;
    this.$events = new EventBus();
  }

  /*
	 * Connect to node via web socket
	 * subscribe to NewBlocks, NewTxs(optional)
	 * emit data through observable pattern
	 */
  public connect(eventsTypes: string[] = []): Promise {
    return new Promise((resolve, reject) => {
      if (!this.options.node_ws) {
        console.error('You need set node_ws property in connect method arguments');
        reject();
      }

      /*
			 * Create an observable object with
			 * socket instance and event handlers
			 * WebSocket events handlers
			 */

      // Socket events/messages handler
       const messageHandler = (event: any) => {

        // Differences formats of ws class for node and browser
        const parsedEvent = this.isNode ? JSON.parse(event) : JSON.parse(event.data);
        const eventData = parsedEvent.result.data;

        if (!eventData) {
          this.$events.emit('unknown', {
            type: 'unknown',
            data: parsedEvent,
          });
          return;
        }

        // Switch models by event types
        if (eventData.type === 'tendermint/event/NewBlock') {
          this.$events.emit('block', {
            type: 'block',
            data: new BlockModel(eventData.value.block),
          });
        } else if (eventData.type === 'tendermint/event/Tx') {
          this.$events.emit('tx', {
            type: 'tx',
            data: new TxModel(eventData.value.TxResult),
          });
        }
      };

      // when socket opened
       const openHandler = () => {
        this.isSynced = true;

        if (this.options.logs) {
          console.info('Connected to node web socket');
        }

        // Subscribe to initial events
        eventsTypes.forEach((eventType) => this.action('subscribe', eventType));

        resolve();
      };

      // when socket closed
       const closeHandler = (error) => {
        this.connection = null;
        this.isSynced = false;

        console.error('TendermintWebSocket/Errors: Error in web socket connection:', error);
        reject();
      };

       const errorHandler = (error) => {
        console.error('TendermintWebSocket/Errors: Socket error:', error);
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
          this.connection.on('close', (error) => closeHandler(error));
          this.connection.on('error', (error) => errorHandler(error));
          this.connection.on('message', (event) => messageHandler(event));
        } else {
          this.connection = new WebSocket(wsUrl);
          this.connection.onopen = () => openHandler();
          this.connection.onclose = (error) => closeHandler(error);
          this.connection.onerror = (error) => errorHandler(error);
          this.connection.onmessage = (event) => messageHandler(event);
        }

      } catch (e) {
        console.error(`TendermintWebSocket/Errors: Error in web socket connection: ${e}`);
        reject();
      }
    });
  }

  /*
	 * Subscribe/Unsubscribe events from Tendermint node
	 */
  public action(
    method: 'subscribe'|'unsubscribe',
    type: string,
  ): void {
    try {
      let methodParams: {
        id: string;
        query: string;
      };

      if (type === 'blocks') {
        methodParams = {
          id:  `${method}-out-blocks`,
          query: 'tm.event=\'NewBlock\'',
        };
      } else if (type === 'txs') {
        methodParams = {
          id:  `${method}-out-txs`,
          query: 'tm.event=\'Tx\'',
        };
      } else {
        return;
      }

      this.connection.send(JSON.stringify({
        id: methodParams.id,
        jsonrpc: '2.0',
        params: { query: methodParams.query },
        method,
      }));
    } catch (e) {
      console.error(e);
    }
  }
}
