var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var path = require('path');

var OUTPUT_DIR = './dist';

function babelConfig(esmodules, minimize) {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          loose: true,
          targets: esmodules ? { esmodules: true } : undefined
        }
      ],
      '@babel/react'
    ],
    plugins: minimize
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

function webpackConfig(esmodules, minimize) {
  return {
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    entry: {
      [minimize ? 'audioplayer.min' : 'audioplayer']: './src/index.js'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    output: {
      path: path.join(__dirname, OUTPUT_DIR),
      publicPath: '/dist',
      libraryTarget: 'umd',
      libraryExport: 'default',
      library: 'AudioPlayer',
      filename: `${esmodules ? 'esm/' : 'es5/'}[name].js`
    },
    devServer: {
      inline: true,
      staticOptions: { index: 'example.html' }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
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
      react: {
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
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        path: path.join(__dirname, OUTPUT_DIR, 'css')
      }),
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

var configResult = (function() {
  switch (process.env.BUILD_MODE) {
    case 'minimize':
      return [webpackConfig(true, true), webpackConfig(false, true)];
    case 'unminimized':
      return [webpackConfig(true, false), webpackConfig(false, false)];
    case 'all':
    default:
      return [
        webpackConfig(true, true),
        webpackConfig(false, true),
        webpackConfig(true, false),
        webpackConfig(false, false)
      ];
  }
})();

module.exports = configResult;
