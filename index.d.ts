declare module 'tendermint-js-client' {
	import {
		IBlock,
		IClientOptions,
		IStatus,
		ITx
	} from './src';

	export class BlockModel {
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