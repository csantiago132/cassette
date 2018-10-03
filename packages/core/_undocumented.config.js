var path = require('path');

var OUTPUT_DIR = './dist';

module.exports = {
  mode: 'production',
  entry: './src/_undocumented/index.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, OUTPUT_DIR),
    filename: '_undocumented.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  loose: true
                }
              ]
            ],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    noEmitOnErrors: true,
    minimize: false
  }
};
