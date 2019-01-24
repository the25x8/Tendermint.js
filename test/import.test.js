import { TendermintClient } from '../lib/tendermint.js';

test('Import lib as ES6 module', () => {
	const instance = new TendermintClient();
	expect(instance.test()).toEqual('ok');
})