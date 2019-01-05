const { TendermintClient } = require('../lib/index');

const instance = new TendermintClient();
console.log(instance.test())