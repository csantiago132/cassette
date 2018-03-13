var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

const minimize = process.env.BUILD_MODE === 'minimize';

var webpackConfig = {
  entry: {
    [minimize ? 'audioplayer.min' : 'audioplayer']: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist',
    libraryTarget: 'umd',
    libraryExport: 'default',
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
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'transform-object-rest-spread',
              ...(minimize
                ? [[
                  'transform-react-remove-prop-types',
                  { mode: 'remove', removeImport: true }
                ]]
                : [])
            ]
          }
        }
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
    new MiniCssExtractPlugin('[name].css'),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.min\.css$/
    }),
    new CompressionPlugin()
  ],
  optimization: {
    noEmitOnErrors: true,
    minimize
  }
};

module.exports = webpackConfig;
