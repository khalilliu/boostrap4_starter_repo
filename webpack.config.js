const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const webpack = require('webpack');
const glob = require('glob');

const extractSass = new ExtractTextPlugin({
	filename: "[name].[contenthash:8].css",
	disable: process.env.NODE_ENV === 'development'
});

module.exports = {
	entry: {
		app: './src',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module:{
		rules: [
			{
				test: /\.(css|sass|scss)$/,
				use: extractSass.extract({
					use: [{
						loader: 'css-loader',
					},{
			      loader: 'postcss-loader', // Run post css actions
			      options: {
			        plugins: function () { // post css plugins, can be exported to postcss.config.js
			          return [
			            require('precss'),
			            require('autoprefixer')
			          ];
			        }
			      }
			    },
					{
						loader: 'sass-loader',
					}],
					fallback: 'style-loader',
				}),
			},
			{
				test: /.js$/,
				use: [
					{
						loader: 'babel-loader',
						options:{
							presets: ['env']
						},
					},
				]
			},
			{
				test:/\.(jpg|png|jpeg)$/,
				use:[
					{
						loader: 'file-loader',
						options:{
							name: '[name].[ext]',
							outputPath: 'img/',
							publicPath: '/'
						}
					}
				],
			},
			{
				test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: "file-loader",
					options:{
						name: '[name].[ext]'
					}
				}
			}
		]
	},
	plugins:[
		new webpack.ProvidePlugin({
			$:'jquery',
			jQuery:'jquery',
		}),
		extractSass,
		new PurifyCSSPlugin({
			paths: glob.sync(path.resolve(__dirname,'src/*'))
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html',
		}),
		new CleanWebpackPlugin(['dist'])
	]
};
