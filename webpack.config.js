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
	devServer:{
		 contentBase: './dist'
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
				test:/.html$/,
				use:[
					{
						loader: 'html-loader',
						options: {
			        minimize: true,
			        name: '[name].[ext]',
			      }
					}
				]	
			},
			{
				test: /\.(png|jp(e*)g|svg)$/,
				use:[
					{
						loader: 'file-loader',
						options:{
							limit: 8000,
							name: '[name].[ext]',
							outputPath: 'img/'
						}
					}
				],
			},
			{
       test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
       use: [{
         loader: 'file-loader',
         options: {
           name: '[name].[ext]',
           outputPath: 'fonts/',    // where the fonts will go
           publicPath: '../'       // override the default path
         }
       }]
      },
		]
	},
	plugins:[
		new CleanWebpackPlugin(['dist']),
		new webpack.ProvidePlugin({
			$:'jquery',
			jQuery:'jquery',
			Tether: 'tether',
			"window.jQuery": "jquery",
      "window.Tether": 'tether'
		}),
		extractSass,
		// new PurifyCSSPlugin({
		// 	paths: glob.sync(path.resolve(__dirname,'src/*'))
		// }),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html',
		})
	]
};
