declare module 'tendermint-js-client' {
	export class TendermintClient {
		public status: any;
		public events: any;
		public isSynced: boolean;

		constructor(options: {
			node_rpc: string;
			node_ws: string;
			autoSyncToWs?: boolean;
		});

		public connect(): void;
		public test(): string;
	}
}