var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './app/main',

  output: {
    path: './build',
    filename: 'bundle.js', // deployable file
    publicPath: 'http://localhost:8080/build' // dev server
  },

  //   plugins: [
  //   new ExtractTextPlugin('style.css', { allChunks: true })
  // ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,      
        loader: 'babel-loader',
        include: path.resolve(__dirname, "app") // must be fully qualified file path
      },
      {
        test: /\.css$/,
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' 
      },
      { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
      { test: /\.png$/, loader: "url-loader?limit=10000&mimetype=image/png" },

    ],
  },
    resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
};
