var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');


var init = path.join(__dirname, 'app/init.js');
var app = path.join(__dirname, 'app/main.js');
var dist = path.join(__dirname, 'dist');

module.exports = {
  entry: {
    "app": app,
    "init": init
  },
  devtool: 'source-map',
  output: {
    path: dist,
    filename: '[name].js',
    publicPath: '/dist'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          presets: ['es2015', 'es2016', 'es2017']
        }
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
};
