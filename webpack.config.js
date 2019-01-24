const path = require('path');

// Build mode
const mode = process.env.MODE ? process.env.MODE : 'development';
const target = process.env.TARGET ? process.env.TARGET : 'node';

module.exports = {
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'tendermint' + target === 'web' ? '.umd.js' : '.js',
		libraryTarget: 'umd',
		library: 'tendermintJs',
		umdNamedDefine: true
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
}
