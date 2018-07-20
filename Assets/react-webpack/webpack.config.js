var webpack = require('webpack');
var loaders = require('./webpack.loaders');

var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

module.exports = {
	entry: {
		'converter': './src/converter.jsx'
	},
	output: {
		publicPath: '/',
		path: '../../webroot/js',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new webpack.ProvidePlugin({
           _: "underscore"
       	}),
	    new ModernizrWebpackPlugin({
			'minify' : false,
			'feature-detects': [
				"file/api"
			]
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin()
	]
};
