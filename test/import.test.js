import TendermintJS from '../lib/tendermint.js';

test('Import lib as ES6 module', () => {
	const instance = new TendermintJS();
	expect(instance.test()).toEqual('ok');
})