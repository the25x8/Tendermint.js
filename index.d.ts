declare module 'tendermint-js-client' {
	export class TendermintClient {
		constructor();

		connect(): void;
		test(): string;
	}
}