var path = require('path');

const contextPropNames = [
  'playlist',
  'activeTrackIndex',
  'trackLoading',
  'paused',
  'currentTime',
  'seekPreviewTime',
  'seekInProgress',
  'awaitingResumeOnSeekComplete',
  'duration',
  'bufferedRanges',
  'playedRanges',
  'seekableRanges',
  'volume',
  'muted',
  'shuffle',
  'stalled',
  'playbackRate',
  'setVolumeInProgress',
  'repeatStrategy',
  'pipeVideoStreamToCanvas',
  'onTogglePause',
  'onSelectTrackIndex',
  'onBackSkip',
  'onForwardSkip',
  'onSeekPreview',
  'onSeekComplete',
  'onSetVolume',
  'onSetVolumeComplete',
  'onToggleMuted',
  'onToggleShuffle',
  'onSetRepeatStrategy',
  'onSetPlaybackRate',
  'fullscreen',
  'requestFullscreen',
  'requestExitFullscreen'
];

module.exports = {
  sections: [
    {
      name: '@cassette/core',
      components: 'packages/core/src/[A-Z]*.js'
    },
    {
      name: '@cassette/components',
      components: 'packages/components/src/[A-Z]*.js'
    },
    {
      name: '@cassette/player',
      sections: [
        {
          name: 'Player Components',
          components: 'packages/player/src/[A-Z]*.js'
        },
        {
          name: 'Control Components',
          components: 'packages/player/src/controls/[A-Z]*.js'
        }
      ]
    }
  ],
  webpackConfig: {
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@cassette/core': path.join(__dirname, 'packages/core/src'),
        '@cassette/components': path.join(__dirname, 'packages/components/src'),
        '@cassette/player': path.join(__dirname, 'packages/player/src')
      }
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
                ['@babel/preset-env', { modules: false, loose: true }],
                '@babel/react'
              ],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
        },
        {
          test: /\.scss$/,
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        }
      ]
    },
    devtool: 'source-map',
    optimization: {
      noEmitOnErrors: true,
      minimize: false
    }
  },
  ignore: [
    '**/ShuffleManager.js',
    '**/PlayerPropTypes.js',
    '**/PlayerContext.js',
    '**/GroupContext.js',
    '**/FullscreenContext.js',
    '**/ButtonWrapper.js',
    '**/SkipButton.js',
    '**/MediaStatusBar.js'
  ],
  usageMode: 'expand',
  propsParser(filePath, source, resolver, handlers) {
    const parsed = require('react-docgen').parse(source, resolver, handlers);
    for (const p of parsed) {
      for (const key of Object.keys(p.props || {})) {
        if (contextPropNames.indexOf(key) !== -1) {
          delete p.props[key];
        }
      }
      if (p.props && Object.keys(p.props).length === 0) {
        delete p.props;
      }
    }
    return parsed;
  },
  handlers(componentPath) {
    return require('react-docgen').defaultHandlers.concat(
      require('react-docgen-external-proptypes-handler')(componentPath),
      require('react-docgen-displayname-handler').createDisplayNameHandler(
        componentPath
      )
    );
  }
};
