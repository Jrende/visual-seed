let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
const extractLess = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
      inject: true
    }),
    /*
    new UglifyJSPlugin({
      sourceMap: true
    }),
    */
    extractLess,
    new CopyWebpackPlugin([ './src/init.js' ])
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(frag|vert|ftl)$/,
        use: {
          loader: 'raw-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [
            {
              loader: 'css-loader' // translates CSS into CommonJS
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader',
              options: {
                strictMath: true,
                noIeCompat: true
              }
            }
          ]
        })
      },
    ]
  }
};

