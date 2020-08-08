/// <reference types="./source/globals" />

import path from 'path';
import {Configuration} from 'webpack';
import SizePlugin from 'size-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

module.exports = (_environment: string, argv: Record<string, boolean | number | string>): Configuration => ({
	devtool: 'source-map',
	stats: {
		all: false,
		errors: true,
		builtAt: true
	},
	entry: Object.fromEntries([
		'hide-files-on-github',
		'background',
		'options'
	].map(name => [name, `./source/${name}`])),
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
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
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'source',
					globOptions: {
						ignore: [
							'**/*.ts',
							'**/*.tsx'
						]
					}
				},
				{
					from: 'node_modules/webext-base-css/webext-base.css'
				}
			]
		}),
		new SizePlugin({
			writeFile: false
		})
	],
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		]
	},
	optimization: {
		// Automatically enabled on production;
		// Keeps it somewhat readable for AMO reviewers
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: false,
					compress: {
						defaults: false,
						dead_code: true,
						unused: true,
						arguments: true,
						join_vars: false,
						booleans: false,
						expression: false,
						sequences: false
					},
					output: {
						beautify: true,
						indent_level: 2
					}
				}
			})
		]
	}
});
