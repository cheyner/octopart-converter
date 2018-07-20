"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');

var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

module.exports = {
	entry: {
		'converter': './src/converter.jsx'
	},
	devtool: 'eval-source-map',
	output: {
		publicPath: '/',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
           _: "underscore"
       	}),
	    new ModernizrWebpackPlugin({
			'minify' : true,
			'feature-detects': [
				"file/api"
			]
		})
	]
};
