const { TendermintClient } = require('../lib/tendermint.js');

test('Require lib as commonjs module', () => {
	const instance = new TendermintClient();
	expect(instance.test()).toEqual('ok');
})