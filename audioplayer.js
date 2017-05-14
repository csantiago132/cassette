(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["AudioPlayer"] = factory(require("react"));
	else
		root["AudioPlayer"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _arrayFindIndex = __webpack_require__(2);

	var _arrayFindIndex2 = _interopRequireDefault(_arrayFindIndex);

	var _classnames = __webpack_require__(3);

	var _classnames2 = _interopRequireDefault(_classnames);

	__webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var log = console.log.bind(console);
	var logError = console.error ? console.error.bind(console) : log;
	var logWarning = console.warn ? console.warn.bind(console) : log;

	/* converts given number of seconds to standard time display format
	 * http://goo.gl/kEvnKn
	 */
	function convertToTime(number) {
	  var mins = Math.floor(number / 60);
	  var secs = (number % 60).toFixed();
	  return '' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
	}

	/*
	 * AudioPlayer
	 *
	 * Accepts 'playlist' prop of the form:
	 *
	 * [{ "url": "./path/to/file.mp3",
	 *    "displayText": "ArtistA - Track 1" },
	 *  { "url": "https://domain.com/track2.ogg",
	 *    "displayText": "ArtistB - Track 2" }]
	 *
	 * Accepts 'autoplay' prop (true/[false]).
	 *
	 * Accepts 'autoplayDelayInSeconds' prop (default 0).
	 *
	 * Accepts 'gapLengthInSeconds' prop (default 0).
	 * Specifies gap at end of one track before next
	 * track begins (ignored for manual skip).
	 *
	 * Accepts 'hideBackSkip' prop (default false,
	 * hides back skip button if true).
	 *
	 * Accepts 'hideForwardSkip' prop (default false,
	 * hides forward skip button if true).
	 *
	 * Accepts 'disableSeek' prop (default false,
	 * disables seeking through the audio if true).
	 *
	 * Accepts 'cycle' prop (default true,
	 * starts playing at the beginning of the playlist
	 * when finished if true).
	 *
	 * Accepts 'stayOnBackSkipThreshold' prop, default 5,
	 * is number of seconds to progress until pressing back skip
	 * restarts the current track.
	 *
	 * Accepts 'style' prop, object, is applied to
	 * outermost div (React styles).
	 *
	 * Accepts 'onMediaEvent' prop, an object used for
	 * listening to media events on the underlying audio element.
	 *
	 * Accepts 'audioElementRef' prop, a function called after
	 * the component mounts and before it unmounts with the
	 * internally-referenced HTML audio element as its only parameter.
	 * Similar to: https://facebook.github.io/react/docs/refs-and-the-dom.html
	 */

	var AudioPlayer = function (_React$Component) {
	  _inherits(AudioPlayer, _React$Component);

	  function AudioPlayer(props) {
	    _classCallCheck(this, AudioPlayer);

	    /* true if the user is currently dragging the mouse
	     * to seek a new track position
	     */
	    var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this, props));

	    _this.seekInProgress = false;
	    // index matching requested track (whether track has loaded or not)
	    _this.currentTrackIndex = 0;

	    _this.defaultState = {
	      /* activeTrackIndex will change to match
	       * this.currentTrackIndex once metadata has loaded
	       */
	      activeTrackIndex: -1,
	      // indicates whether audio player should be paused
	      paused: true,
	      /* elapsed time for current track, in seconds -
	       * DISPLAY ONLY! the actual elapsed time may
	       * not match up if we're currently seeking, since
	       * the new time is visually previewed before the
	       * audio seeks.
	       */
	      displayedTime: 0
	    };

	    _this.state = _this.defaultState;

	    // html audio element used for playback
	    _this.audio = null;
	    _this.audioProgressContainer = null;
	    /* bounding rectangle used for calculating seek
	     * position from mouse/touch coordinates
	     */
	    _this.audioProgressBoundingRect = null;

	    // event listeners to add on mount and remove on unmount
	    _this.adjustDisplayedTime = _this.adjustDisplayedTime.bind(_this);
	    _this.seekReleaseListener = function (e) {
	      return _this.seek(e);
	    };
	    _this.resizeListener = function () {
	      return _this.fetchAudioProgressBoundingRect();
	    };
	    _this.audioPlayListener = function () {
	      return _this.setState({ paused: false });
	    };
	    _this.audioPauseListener = function () {
	      return _this.setState({ paused: true });
	    };
	    _this.audioEndListener = function () {
	      var gapLengthInSeconds = _this.props.gapLengthInSeconds || 0;
	      clearTimeout(_this.gapLengthTimeout);
	      _this.gapLengthTimeout = setTimeout(function () {
	        return _this.skipToNextTrack();
	      }, gapLengthInSeconds * 1000);
	    };
	    _this.audioStallListener = function () {
	      return _this.togglePause(true);
	    };
	    _this.audioTimeUpdateListener = function () {
	      return _this.handleTimeUpdate();
	    };
	    _this.audioMetadataLoadedListener = function () {
	      return _this.setState({
	        activeTrackIndex: _this.currentTrackIndex
	      });
	    };
	    return _this;
	  }

	  _createClass(AudioPlayer, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      // add event listeners bound outside the scope of our component
	      window.addEventListener('mousemove', this.adjustDisplayedTime);
	      document.addEventListener('touchmove', this.adjustDisplayedTime);
	      window.addEventListener('mouseup', this.seekReleaseListener);
	      document.addEventListener('touchend', this.seekReleaseListener);
	      window.addEventListener('resize', this.resizeListener);
	      this.resizeListener();

	      var audio = this.audio = document.createElement('audio');

	      // add event listeners on the audio element
	      audio.preload = 'metadata';
	      audio.addEventListener('play', this.audioPlayListener);
	      audio.addEventListener('pause', this.audioPauseListener);
	      audio.addEventListener('ended', this.audioEndListener);
	      audio.addEventListener('stalled', this.audioStallListener);
	      audio.addEventListener('timeupdate', this.audioTimeUpdateListener);
	      audio.addEventListener('loadedmetadata', this.audioMetadataLoadedListener);
	      this.addMediaEventListeners(this.props.onMediaEvent);

	      if (this.props.playlist && this.props.playlist.length) {
	        this.updateSource();
	        if (this.props.autoplay) {
	          var delay = this.props.autoplayDelayInSeconds || 0;
	          clearTimeout(this.delayTimeout);
	          this.delayTimeout = setTimeout(function () {
	            return _this2.togglePause(false);
	          }, delay * 1000);
	        }
	      }

	      if (this.props.audioElementRef) {
	        this.props.audioElementRef(audio);
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      // remove event listeners bound outside the scope of our component
	      window.removeEventListener('mousemove', this.adjustDisplayedTime);
	      document.removeEventListener('touchmove', this.adjustDisplayedTime);
	      window.removeEventListener('mouseup', this.seekReleaseListener);
	      document.removeEventListener('touchend', this.seekReleaseListener);
	      window.removeEventListener('resize', this.resizeListener);

	      // remove event listeners on the audio element
	      this.audio.removeEventListener('play', this.audioPlayListener);
	      this.audio.removeEventListener('pause', this.audioPauseListener);
	      this.audio.removeEventListener('ended', this.audioEndListener);
	      this.audio.removeEventListener('stalled', this.audioStallListener);
	      this.audio.removeEventListener('timeupdate', this.audioTimeUpdateListener);
	      this.audio.removeEventListener('loadedmetadata', this.audioMetadataLoadedListener);
	      this.removeMediaEventListeners(this.props.onMediaEvent);
	      clearTimeout(this.gapLengthTimeout);
	      clearTimeout(this.delayTimeout);

	      // pause the audio element before we unmount
	      this.audio.pause();

	      if (this.props.audioElementRef) {
	        this.props.audioElementRef(this.audio);
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      // Update media event listeners that may have changed
	      this.removeMediaEventListeners(this.props.onMediaEvent);
	      this.addMediaEventListeners(nextProps.onMediaEvent);

	      var newPlaylist = nextProps.playlist;
	      if (!newPlaylist || !newPlaylist.length) {
	        if (this.audio) {
	          this.audio.src = '';
	        }
	        this.currentTrackIndex = 0;
	        return this.setState(this.defaultState);
	      }

	      var oldPlaylist = this.props.playlist;

	      var currentTrackUrl = ((oldPlaylist || [])[this.currentTrackIndex] || {}).url;
	      this.currentTrackIndex = (0, _arrayFindIndex2.default)(newPlaylist, function (track) {
	        return track.url && currentTrackUrl === track.url;
	      });
	      /* if the track we're already playing is in the new playlist, update the
	       * activeTrackIndex.
	       */
	      if (this.currentTrackIndex !== -1) {
	        this.setState({
	          activeTrackIndex: this.currentTrackIndex
	        });
	      }
	    }
	  }, {
	    key: 'addMediaEventListeners',
	    value: function addMediaEventListeners(mediaEvents) {
	      var _this3 = this;

	      if (!mediaEvents) {
	        return;
	      }
	      Object.keys(mediaEvents).forEach(function (type) {
	        if (typeof mediaEvents[type] !== 'function') {
	          return;
	        }
	        _this3.audio.addEventListener(type, mediaEvents[type]);
	      });
	    }
	  }, {
	    key: 'removeMediaEventListeners',
	    value: function removeMediaEventListeners(mediaEvents) {
	      var _this4 = this;

	      if (!mediaEvents) {
	        return;
	      }
	      Object.keys(mediaEvents).forEach(function (type) {
	        if (typeof mediaEvents[type] !== 'function') {
	          return;
	        }
	        _this4.audio.removeEventListener(type, mediaEvents[type]);
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      /* if we loaded a new playlist and reset the current track marker, we
	       * should load up the first one.
	       */
	      if (this.audio && this.currentTrackIndex === -1) {
	        this.skipToNextTrack(false);
	      }
	    }
	  }, {
	    key: 'togglePause',
	    value: function togglePause(value) {
	      if (!this.audio) {
	        return;
	      }
	      var pause = typeof value === 'boolean' ? value : !this.state.paused;
	      if (pause) {
	        return this.audio.pause();
	      }
	      if (!this.props.playlist || !this.props.playlist.length) {
	        return;
	      }
	      try {
	        this.audio.play();
	      } catch (error) {
	        logError(error);
	        var warningMessage = 'Audio playback failed at ' + new Date().toLocaleTimeString() + '! (Perhaps autoplay is disabled in this browser.)';
	        logWarning(warningMessage);
	      }
	    }
	  }, {
	    key: 'skipToNextTrack',
	    value: function skipToNextTrack(shouldPlay) {
	      var _this5 = this;

	      if (!this.audio) {
	        return;
	      }
	      this.audio.pause();
	      if (!this.props.playlist || !this.props.playlist.length) {
	        return;
	      }
	      var i = this.currentTrackIndex + 1;
	      if (i >= this.props.playlist.length) {
	        i = 0;
	      }
	      this.currentTrackIndex = i;
	      this.setState({
	        activeTrackIndex: -1,
	        displayedTime: 0
	      }, function () {
	        _this5.updateSource();
	        var shouldPauseOnCycle = !_this5.props.cycle && i === 0;
	        var shouldPause = shouldPauseOnCycle || (typeof shouldPlay === 'boolean' ? !shouldPlay : false);
	        _this5.togglePause(shouldPause);
	      });
	    }
	  }, {
	    key: 'backSkip',
	    value: function backSkip() {
	      if (!this.props.playlist || !this.props.playlist.length) {
	        return;
	      }
	      var audio = this.audio;
	      var stayOnBackSkipThreshold = this.props.stayOnBackSkipThreshold;
	      if (isNaN(stayOnBackSkipThreshold)) {
	        stayOnBackSkipThreshold = 5;
	      }
	      if (audio.currentTime >= stayOnBackSkipThreshold) {
	        return audio.currentTime = 0;
	      }
	      var i = this.currentTrackIndex - 1;
	      if (i < 0) {
	        i = this.props.playlist.length - 1;
	      }
	      this.currentTrackIndex = i - 1;
	      this.skipToNextTrack();
	    }
	  }, {
	    key: 'updateSource',
	    value: function updateSource() {
	      this.audio.src = this.props.playlist[this.currentTrackIndex].url;
	    }
	  }, {
	    key: 'fetchAudioProgressBoundingRect',
	    value: function fetchAudioProgressBoundingRect() {
	      this.audioProgressBoundingRect = this.audioProgressContainer.getBoundingClientRect();
	    }
	  }, {
	    key: 'handleTimeUpdate',
	    value: function handleTimeUpdate() {
	      if (!this.seekInProgress && this.audio) {
	        this.setState({
	          displayedTime: this.audio.currentTime
	        });
	      }
	    }
	  }, {
	    key: 'adjustDisplayedTime',
	    value: function adjustDisplayedTime(event) {
	      if (!this.props.playlist || !this.props.playlist.length || this.props.disableSeek) {
	        return;
	      }
	      // make sure we don't select stuff in the background while seeking
	      if (event.type === 'mousedown' || event.type === 'touchstart') {
	        this.seekInProgress = true;
	        document.body.classList.add('noselect');
	      } else if (!this.seekInProgress) {
	        return;
	      }
	      /* we don't want mouse handlers to receive the event
	       * after touch handlers if we're seeking.
	       */
	      event.preventDefault();
	      var boundingRect = this.audioProgressBoundingRect;
	      var isTouch = event.type.slice(0, 5) === 'touch';
	      var pageX = isTouch ? event.targetTouches.item(0).pageX : event.pageX;
	      var position = pageX - boundingRect.left - document.body.scrollLeft;
	      var containerWidth = boundingRect.width;
	      var progressPercentage = position / containerWidth;
	      this.setState({
	        displayedTime: progressPercentage * this.audio.duration
	      });
	    }
	  }, {
	    key: 'seek',
	    value: function seek(event) {
	      /* this function is activated when the user lets
	       * go of the mouse, so if .noselect was applied
	       * to the document body, get rid of it.
	       */
	      document.body.classList.remove('noselect');
	      if (!this.seekInProgress) {
	        return;
	      }
	      /* we don't want mouse handlers to receive the event
	       * after touch handlers if we're seeking.
	       */
	      event.preventDefault();
	      this.seekInProgress = false;
	      var displayedTime = this.state.displayedTime;
	      if (isNaN(displayedTime)) {
	        return;
	      }
	      this.audio.currentTime = displayedTime;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this6 = this;

	      var activeIndex = this.state.activeTrackIndex;
	      var displayText = this.props.playlist ? activeIndex < 0 ? null : this.props.playlist[activeIndex].displayText : 'Please load a playlist';

	      var displayedTime = this.state.displayedTime;
	      var duration = this.audio && this.audio.duration || 0;

	      var elapsedTime = convertToTime(displayedTime);
	      var fullTime = convertToTime(duration);
	      var timeRatio = elapsedTime + ' / ' + fullTime;

	      var progressBarWidth = displayedTime / duration * 100 + '%';

	      return _react2.default.createElement(
	        'div',
	        {
	          id: 'audio_player',
	          className: 'audio_player',
	          title: displayText,
	          style: this.props.style
	        },
	        _react2.default.createElement(
	          'div',
	          { className: 'audio_controls' },
	          _react2.default.createElement(
	            'div',
	            {
	              id: 'skip_button',
	              className: (0, _classnames2.default)('skip_button back audio_button', {
	                'hidden': this.props.hideBackSkip
	              }),
	              onClick: function onClick() {
	                return _this6.backSkip();
	              }
	            },
	            _react2.default.createElement(
	              'div',
	              { className: 'skip_button_inner' },
	              _react2.default.createElement('div', { className: 'right_facing_triangle' }),
	              _react2.default.createElement('div', { className: 'right_facing_triangle' })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            {
	              id: 'play_pause_button',
	              className: (0, _classnames2.default)('play_pause_button', 'audio_button', {
	                'paused': this.state.paused
	              }),
	              onClick: function onClick() {
	                return _this6.togglePause();
	              }
	            },
	            _react2.default.createElement(
	              'div',
	              { className: 'play_pause_inner' },
	              _react2.default.createElement('div', { className: 'left' }),
	              _react2.default.createElement('div', { className: 'right' }),
	              _react2.default.createElement('div', { className: 'triangle_1' }),
	              _react2.default.createElement('div', { className: 'triangle_2' })
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            {
	              id: 'skip_button',
	              className: (0, _classnames2.default)('skip_button audio_button', {
	                'hidden': this.props.hideForwardSkip
	              }),
	              onClick: function onClick() {
	                return _this6.skipToNextTrack();
	              }
	            },
	            _react2.default.createElement(
	              'div',
	              { className: 'skip_button_inner' },
	              _react2.default.createElement('div', { className: 'right_facing_triangle' }),
	              _react2.default.createElement('div', { className: 'right_facing_triangle' })
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          {
	            id: 'audio_progress_container',
	            className: 'audio_progress_container',
	            ref: function ref(_ref) {
	              return _this6.audioProgressContainer = _ref;
	            },
	            onMouseDown: this.adjustDisplayedTime,
	            onTouchStart: this.adjustDisplayedTime
	          },
	          _react2.default.createElement('div', {
	            id: 'audio_progress',
	            className: 'audio_progress',
	            style: { width: progressBarWidth } }),
	          _react2.default.createElement(
	            'div',
	            { id: 'audio_progress_overlay', className: 'audio_progress_overlay' },
	            _react2.default.createElement(
	              'div',
	              { className: 'audio_info_marquee' },
	              _react2.default.createElement(
	                'div',
	                { id: 'audio_info', className: 'audio_info noselect', draggable: 'false' },
	                displayText
	              )
	            ),
	            _react2.default.createElement(
	              'div',
	              {
	                id: 'audio_time_progress',
	                className: 'audio_time_progress noselect',
	                draggable: 'false'
	              },
	              timeRatio
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return AudioPlayer;
	}(_react2.default.Component);

	AudioPlayer.propTypes = {
	  playlist: _react2.default.PropTypes.array,
	  autoplay: _react2.default.PropTypes.bool,
	  autoplayDelayInSeconds: _react2.default.PropTypes.number,
	  gapLengthInSeconds: _react2.default.PropTypes.number,
	  hideBackSkip: _react2.default.PropTypes.bool,
	  hideForwardSkip: _react2.default.PropTypes.bool,
	  cycle: _react2.default.PropTypes.bool,
	  disableSeek: _react2.default.PropTypes.bool,
	  stayOnBackSkipThreshold: _react2.default.PropTypes.number,
	  style: _react2.default.PropTypes.object,
	  onMediaEvent: _react2.default.PropTypes.object,
	  audioElementRef: _react2.default.PropTypes.func
	};

	AudioPlayer.defaultProps = {
	  cycle: true
	};

	module.exports = AudioPlayer;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	module.exports = function (arr, predicate, ctx) {
		if (typeof Array.prototype.findIndex === 'function') {
			return arr.findIndex(predicate, ctx);
		}

		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}

		var list = Object(arr);
		var len = list.length;

		if (len === 0) {
			return -1;
		}

		for (var i = 0; i < len; i++) {
			if (predicate.call(ctx, list[i], i, list)) {
				return i;
			}
		}

		return -1;
	};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })
/******/ ])
});
;