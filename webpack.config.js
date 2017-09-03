let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

let app = path.join(__dirname, 'app/main.js');
let dist = path.join(__dirname, 'dist');
let index = path.join(__dirname, 'index.html');

module.exports = {
  entry: {
    app
  },
  devtool: 'source-map',
  output: {
    path: dist,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: index,
      inject: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'app/init.js',
        to: ''
      }
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname
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
