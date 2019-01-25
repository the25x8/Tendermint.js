const path = require('path');

module.exports = env => {
	// Build mode
	const mode = env.MODE ? env.MODE : 'development';
	const target = env.TARGET ? env.TARGET : 'node';
	const outputFilename = target === 'web' ? 'tendermint.umd.js' : 'tendermint.js';

	return {
		output: {
			path: path.resolve(__dirname, 'lib'),
			filename: outputFilename,
			libraryTarget: 'umd',
			library: 'TendermintJS',
			libraryExport: 'default'
		},
		target,
		mode,
		entry: './src/index.ts',
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx|js|jsx)$/,
					loader: 'babel-loader',
				},
				{
					test: /\.js$/,
					use: ['source-map-loader'],
					enforce: 'pre'
				}
			]
		}
	};
}
