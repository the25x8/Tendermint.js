const { TendermintClient } = require('../lib/index');

test('Require lib as commonjs module', () => {
	const instance = new TendermintClient();
	expect(instance.test()).toEqual('ok');
})