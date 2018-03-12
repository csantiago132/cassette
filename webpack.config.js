var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var webpackConfig = {
  entry: {
    'audioplayer': './src/index.js',
    'audioplayer.min': './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist',
    libraryTarget: 'umd',
    library: 'AudioPlayer',
    filename: '[name].js'
  },
  devServer: {
    inline: true,
    staticOptions: { index: 'example.html' }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!sass-loader'
        })
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  externals: {
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types'
    },
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'resize-observer-polyfill': {
      root: 'ResizeObserver',
      commonjs: 'resize-observer-polyfill',
      commonjs2: 'resize-observer-polyfill',
      amd: 'resize-observer-polyfill'
    }
  },
  devtool: 'source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.min\.css$/
    })
  ]
};

module.exports = webpackConfig;
