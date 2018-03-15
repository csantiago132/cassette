var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var minimize = process.env.BUILD_MODE === 'minimize';

function babelConfig (esmodules) {
  return {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        loose: true,
        targets: esmodules ? { esmodules: true } : undefined
      }],
      '@babel/react'
    ],
    plugins:
      minimize
        ? [
          '@babel/plugin-proposal-object-rest-spread',
          [
            'transform-react-remove-prop-types',
            { mode: 'remove', removeImport: true }
          ]
        ]
        : ['@babel/plugin-proposal-object-rest-spread']
  };
}

function webpackConfig (esmodules) {
  return {
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    entry: {
      [minimize ? 'audioplayer.min' : 'audioplayer']: './src/index.js',
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
      filename: `[name]${esmodules ? '.esm' : ''}.js`
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
            options: babelConfig(esmodules)
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
}

module.exports = [webpackConfig(true), webpackConfig(false)];
