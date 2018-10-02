module.exports = {
  components: 'src/**/[A-Z]*.js',
  // index 2 is the unminified es2015+ version
  webpackConfig: require('./webpack.config')[2],
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
  handlers(componentPath) {
    return require('react-docgen').defaultHandlers.concat(
      require('react-docgen-external-proptypes-handler')(componentPath),
      require('react-docgen-displayname-handler').createDisplayNameHandler(
        componentPath
      )
    );
  }
};
