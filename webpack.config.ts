'use strict';
const path = require('path');
const SizePlugin = require('size-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
	devtool: 'sourcemap',
	stats: 'errors-only',
	entry: {
		'hide-files-on-github': './source/hide-files-on-github',
		background: './source/background',
		options: './source/options'
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.(js|ts|tsx)$/,
			use: [{
				loader: 'ts-loader',
				query: {
					compilerOptions: {
						// Enables ModuleConcatenation. It must be in here to avoid conflic with ts-node
						module: 'es2015',

						// With this, TS will error but the file will still be generated (on watch only)
						noEmitOnError: argv.watch === false
					}
				}
			}],
			exclude: /node_modules/
		}]
	},
	plugins: [
		new SizePlugin({
			writeFile: false
		}),
		new CopyWebpackPlugin([
			{
				from: '**',
				context: 'source',
				ignore: [
					'*.ts',
					'*.tsx'
				]
			},
			{
				from: 'node_modules/webext-base-css/webext-base.css'
			}
		])
	],
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		]
	},
	optimization: {
		concatenateModules: true,

		// Automatically enabled on production; keeps it somewhat readable for AMO reviewers
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2
					}
				}
			})
		]
	}
});
