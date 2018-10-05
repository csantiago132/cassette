(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("prop-types"), require("react"), require("@cassette/core"), require("resize-observer-polyfill"));
	else if(typeof define === 'function' && define.amd)
		define(["prop-types", "react", "@cassette/core", "resize-observer-polyfill"], factory);
	else if(typeof exports === 'object')
		exports["cassetteComponents"] = factory(require("prop-types"), require("react"), require("@cassette/core"), require("resize-observer-polyfill"));
	else
		root["cassetteComponents"] = factory(root["PropTypes"], root["React"], root["cassetteCore"], root["ResizeObserver"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__3__;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"root":"React","commonjs":"react","commonjs2":"react","amd":"react"}
var external_root_React_commonjs_react_commonjs2_react_amd_react_ = __webpack_require__(1);
var external_root_React_commonjs_react_commonjs2_react_amd_react_default = /*#__PURE__*/__webpack_require__.n(external_root_React_commonjs_react_commonjs2_react_amd_react_);

// EXTERNAL MODULE: external {"root":"PropTypes","commonjs":"prop-types","commonjs2":"prop-types","amd":"prop-types"}
var external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_ = __webpack_require__(0);
var external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_);

// EXTERNAL MODULE: external {"root":"ResizeObserver","commonjs":"resize-observer-polyfill","commonjs2":"resize-observer-polyfill","amd":"resize-observer-polyfill"}
var external_root_ResizeObserver_commonjs_resize_observer_polyfill_commonjs2_resize_observer_polyfill_amd_resize_observer_polyfill_ = __webpack_require__(3);
var external_root_ResizeObserver_commonjs_resize_observer_polyfill_commonjs2_resize_observer_polyfill_amd_resize_observer_polyfill_default = /*#__PURE__*/__webpack_require__.n(external_root_ResizeObserver_commonjs_resize_observer_polyfill_commonjs2_resize_observer_polyfill_amd_resize_observer_polyfill_);

// CONCATENATED MODULE: ./packages/components/src/MaybeMarquee.js
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }




var getNow = typeof performance !== 'undefined' && performance.now ? function () {
  return performance.now();
} : function () {
  return Date.now();
};

function pxToNum(px) {
  return Number(px.slice(0, -2));
}

function numToPx(num) {
  return num + "px";
}

var MaybeMarquee_MaybeMarquee =
/*#__PURE__*/
function (_PureComponent) {
  _inheritsLoose(MaybeMarquee, _PureComponent);

  function MaybeMarquee(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.state = {
      contentHeight: 0
    };
    _this.moveMarquee = _this.moveMarquee.bind(_assertThisInitialized(_this));
    _this.handleResize = _this.handleResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = MaybeMarquee.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.animationFrameRequest = requestAnimationFrame(this.moveMarquee);
    this.marqueeContainerElementWidth = getComputedStyle(this.marqueeContainerElement).width;
    var contentStyle = getComputedStyle(this.movingContentContainerElement);
    this.movingContentContainerElementWidth = contentStyle.width;
    this.setState({
      contentHeight: contentStyle.height
    });
    this.resizeObserver = new external_root_ResizeObserver_commonjs_resize_observer_polyfill_commonjs2_resize_observer_polyfill_amd_resize_observer_polyfill_default.a(this.handleResize);
    this.resizeObserver.observe(this.marqueeContainerElement);
    this.resizeObserver.observe(this.movingContentContainerElement);
    this.lastMovementTime = getNow();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameRequest);
    this.resizeObserver.disconnect();
  };

  _proto.moveMarquee = function moveMarquee() {
    var _props = this.props,
        pixelsPerSecond = _props.pixelsPerSecond,
        scrollDirection = _props.scrollDirection;
    var now = getNow();
    var dt = now - this.lastMovementTime;
    this.lastMovementTime = now;

    if (scrollDirection === 'left') {
      this.movingContentContainerElement.style.right = undefined;
    } else {
      this.movingContentContainerElement.style.left = undefined;
    }

    if (this.marqueeContainerElementWidth >= this.movingContentContainerElementWidth) {
      // no scrolling since all the content fits
      this.movingContentContainerElement.style[scrollDirection] = 0;
    } else {
      var movementInPixels = pixelsPerSecond * dt / 1000;
      var newOffset = pxToNum(this.movingContentContainerElement.style[scrollDirection]) - movementInPixels;

      if (newOffset > 0 - this.movingContentContainerElementWidth) {
        // we still have room to scroll.. keep going
        this.movingContentContainerElement.style[scrollDirection] = numToPx(newOffset);
      } else {
        // the content is off the screen so we should wrap around
        this.movingContentContainerElement.style[scrollDirection] = numToPx(this.marqueeContainerElementWidth);
      }
    }

    this.animationFrameRequest = requestAnimationFrame(this.moveMarquee);
  };

  _proto.handleResize = function handleResize(entries) {
    for (var _iterator = entries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _entry = _ref;

      if (_entry.target === this.marqueeContainerElement) {
        this.marqueeContainerElementWidth = _entry.contentRect.width;
      }

      if (_entry.target === this.movingContentContainerElement) {
        this.movingContentContainerElementWidth = _entry.contentRect.width;
        this.setState({
          contentHeight: _entry.contentRect.height
        });
      }
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _props2 = this.props,
        content = _props2.content,
        attributes = _objectWithoutProperties(_props2, ["content"]);

    delete attributes.pixelsPerSecond;
    delete attributes.scrollDirection;
    return external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", _extends({}, attributes, {
      ref: function ref(elem) {
        return _this2.marqueeContainerElement = elem;
      },
      style: _objectSpread({
        position: 'relative',
        overflow: 'hidden',
        height: this.state.contentHeight
      }, attributes.style || {})
    }), external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", {
      ref: function ref(elem) {
        return _this2.movingContentContainerElement = elem;
      },
      style: {
        position: 'absolute',
        whiteSpace: 'nowrap'
      }
    }, content));
  };

  return MaybeMarquee;
}(external_root_React_commonjs_react_commonjs2_react_amd_react_["PureComponent"]);
MaybeMarquee_MaybeMarquee.propTypes = {
  content: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.node.isRequired,
  pixelsPerSecond: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.number.isRequired,
  scrollDirection: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.oneOf(['left', 'right']).isRequired
};
MaybeMarquee_MaybeMarquee.defaultProps = {
  pixelsPerSecond: 30,
  scrollDirection: 'left'
};
/* harmony default export */ var src_MaybeMarquee = (MaybeMarquee_MaybeMarquee);
// EXTERNAL MODULE: external {"root":"cassetteCore","commonjs":"@cassette/core","commonjs2":"@cassette/core","amd":"@cassette/core"}
var core_ = __webpack_require__(2);

// CONCATENATED MODULE: ./packages/components/src/utils/getProgressStyle.js
function getProgressStyle(progress, progressDirection) {
  var progressAheadPercentage = (1 - (progress || 0)) * 100 + "%";
  var style = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };

  switch (progressDirection) {
    case 'left':
      style.left = progressAheadPercentage;
      style.willChange = 'left';
      break;

    case 'right':
      style.right = progressAheadPercentage;
      style.willChange = 'right';
      break;

    case 'up':
      style.top = progressAheadPercentage;
      style.willChange = 'top';
      break;

    case 'down':
      style.bottom = progressAheadPercentage;
      style.willChange = 'bottom';
      break;

    default:
      break;
  }

  return style;
}

/* harmony default export */ var utils_getProgressStyle = (getProgressStyle);
// CONCATENATED MODULE: ./packages/components/src/utils/getHandleStyle.js
function getHandleStyle(progress, progressDirection) {
  var progressPercentage = (progress || 0) * 100 + "%";
  var style = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)'
  };

  switch (progressDirection) {
    case 'left':
      style.top = '50%';
      style.right = progressPercentage;
      style.willChange = 'right';
      style.transform = 'translate(50%, -50%)';
      break;

    case 'right':
      style.top = '50%';
      style.left = progressPercentage;
      style.willChange = 'left';
      style.transform = 'translate(-50%, -50%)';
      break;

    case 'up':
      style.left = '50%';
      style.bottom = progressPercentage;
      style.willChange = 'bottom';
      style.transform = 'translate(-50%, 50%)';
      break;

    case 'down':
      style.left = '50%';
      style.top = progressPercentage;
      style.willChange = 'top';
      style.transform = 'translate(-50%, -50%)';
      break;

    default:
      break;
  }

  return style;
}

/* harmony default export */ var utils_getHandleStyle = (getHandleStyle);
// CONCATENATED MODULE: ./packages/components/src/ProgressBarDisplay.js
function ProgressBarDisplay_extends() { ProgressBarDisplay_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ProgressBarDisplay_extends.apply(this, arguments); }

function ProgressBarDisplay_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { ProgressBarDisplay_defineProperty(target, key, source[key]); }); } return target; }

function ProgressBarDisplay_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ProgressBarDisplay_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }






var ProgressBarDisplay = Object(external_root_React_commonjs_react_commonjs2_react_amd_react_["forwardRef"])(function (_ref, ref) {
  var progressClassName = _ref.progressClassName,
      progressStyle = _ref.progressStyle,
      progress = _ref.progress,
      progressDirection = _ref.progressDirection,
      handle = _ref.handle,
      rest = ProgressBarDisplay_objectWithoutProperties(_ref, ["progressClassName", "progressStyle", "progress", "progressDirection", "handle"]);

  return external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", ProgressBarDisplay_extends({}, rest, {
    ref: ref
  }), external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      touchAction: 'none'
    }
  }, external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", {
    className: progressClassName,
    style: ProgressBarDisplay_objectSpread({}, utils_getProgressStyle(progress, progressDirection), progressStyle || {})
  }), handle && external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", {
    style: utils_getHandleStyle(progress, progressDirection)
  }, handle)));
});
ProgressBarDisplay.propTypes = {
  progressClassName: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.string,
  progressStyle: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.object,
  progress: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.number.isRequired,
  progressDirection: core_["PlayerPropTypes"].progressDirection.isRequired,
  handle: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.element
};
/* harmony default export */ var src_ProgressBarDisplay = (ProgressBarDisplay);
// CONCATENATED MODULE: ./packages/components/src/ProgressBar.js
function ProgressBar_extends() { ProgressBar_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ProgressBar_extends.apply(this, arguments); }

function ProgressBar_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function ProgressBar_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function ProgressBar_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }





var noselectStyles = "\ncursor: default;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-touch-callout: none;\n";
var ProgressBar_ProgressBar =
/*#__PURE__*/
function (_PureComponent) {
  ProgressBar_inheritsLoose(ProgressBar, _PureComponent);

  function ProgressBar(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.progressContainer = null; // bind methods fired on React events

    _this.setProgressContainerRef = _this.setProgressContainerRef.bind(ProgressBar_assertThisInitialized(_this));
    _this.handleAdjustProgress = _this.handleAdjustProgress.bind(ProgressBar_assertThisInitialized(_this)); // bind listeners to add on mount and remove on unmount

    _this.handleAdjustComplete = _this.handleAdjustComplete.bind(ProgressBar_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ProgressBar.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    // add event listeners bound outside the scope of our component
    window.addEventListener('mousemove', this.handleAdjustProgress);
    document.addEventListener('touchmove', this.handleAdjustProgress);
    window.addEventListener('mouseup', this.handleAdjustComplete);
    document.addEventListener('touchend', this.handleAdjustComplete);
    setTimeout(function () {
      var style = document.createElement('style');
      var className = "noselect_" + Math.random().toString(16).slice(2, 7);
      style.innerText = "." + className + "{" + noselectStyles + "}";
      document.body.appendChild(style);
      _this2.noselectStyleElement = style;
      _this2.noselectClassName = className;
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    // remove event listeners bound outside the scope of our component
    window.removeEventListener('mousemove', this.handleAdjustProgress);
    document.removeEventListener('touchmove', this.handleAdjustProgress);
    window.removeEventListener('mouseup', this.handleAdjustComplete);
    document.removeEventListener('touchend', this.handleAdjustComplete); // remove noselect class in case a drag is in progress

    this.toggleNoselect(false);
    this.noselectStyleElement.parentNode.removeChild(this.noselectStyleElement);
  };

  _proto.setProgressContainerRef = function setProgressContainerRef(ref) {
    this.progressContainer = ref;
  };

  _proto.toggleNoselect = function toggleNoselect(on) {
    document.body.classList[on ? 'add' : 'remove'](this.noselectClassName);
  };

  _proto.getProgressFromPageCoordinates = function getProgressFromPageCoordinates(pageX, pageY) {
    var _progressContainer$ge = this.progressContainer.getBoundingClientRect(),
        left = _progressContainer$ge.left,
        top = _progressContainer$ge.top,
        width = _progressContainer$ge.width,
        height = _progressContainer$ge.height;

    var _document$body = document.body,
        scrollLeft = _document$body.scrollLeft,
        scrollTop = _document$body.scrollTop;

    switch (this.props.progressDirection) {
      case 'down':
        return (pageY - top - scrollTop) / height;

      case 'left':
        return 1 - (pageX - left - scrollLeft) / width;

      case 'up':
        return 1 - (pageY - top - scrollTop) / height;

      case 'right':
      default:
        return (pageX - left - scrollLeft) / width;
    }
  };

  _proto.handleAdjustProgress = function handleAdjustProgress(event) {
    var _props = this.props,
        readonly = _props.readonly,
        adjusting = _props.adjusting,
        onAdjustProgress = _props.onAdjustProgress;

    if (readonly) {
      return;
    } // make sure we don't select stuff in the background


    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.toggleNoselect(true);
    } else if (!adjusting) {
      return;
    }
    /* we don't want mouse handlers to receive the event
     * after touch handlers, so prevent default
     */


    event.preventDefault();
    var isTouch = event.type.slice(0, 5) === 'touch';
    var pageX = isTouch ? event.targetTouches.item(0).pageX : event.pageX;
    var pageY = isTouch ? event.targetTouches.item(0).pageY : event.pageY;
    var progress = this.getProgressFromPageCoordinates(pageX, pageY);
    var progressInBounds = Object(core_["convertToNumberWithinIntervalBounds"])(progress, 0, 1);
    onAdjustProgress(progressInBounds);
  };

  _proto.handleAdjustComplete = function handleAdjustComplete(event) {
    var _props2 = this.props,
        adjusting = _props2.adjusting,
        onAdjustComplete = _props2.onAdjustComplete;
    /* this function is activated when the user lets go of
     * the mouse, so if noselect was applied
     * to the document body, get rid of it.
     */

    this.toggleNoselect(false);

    if (!adjusting) {
      return;
    }
    /* we don't want mouse handlers to receive the event
     * after touch handlers, so prevent default
     */


    event.preventDefault();

    if (typeof onAdjustComplete === 'function') {
      onAdjustComplete();
    }
  };

  _proto.render = function render() {
    var _props3 = this.props,
        progressClassName = _props3.progressClassName,
        progressStyle = _props3.progressStyle,
        progress = _props3.progress,
        progressDirection = _props3.progressDirection,
        handle = _props3.handle,
        attributes = ProgressBar_objectWithoutProperties(_props3, ["progressClassName", "progressStyle", "progress", "progressDirection", "handle"]);

    delete attributes.adjusting;
    delete attributes.readonly;
    delete attributes.onAdjustProgress;
    delete attributes.onAdjustComplete;
    return external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement(src_ProgressBarDisplay, ProgressBar_extends({}, attributes, {
      ref: this.setProgressContainerRef,
      progressClassName: progressClassName,
      progressStyle: progressStyle,
      progress: progress,
      progressDirection: progressDirection,
      handle: handle,
      onMouseDown: this.handleAdjustProgress,
      onTouchStart: this.handleAdjustProgress
    }));
  };

  return ProgressBar;
}(external_root_React_commonjs_react_commonjs2_react_amd_react_["PureComponent"]);
ProgressBar_ProgressBar.propTypes = {
  progressClassName: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.string,
  progressStyle: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.object,
  progress: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.number.isRequired,
  progressDirection: core_["PlayerPropTypes"].progressDirection.isRequired,
  handle: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.element,
  adjusting: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.bool.isRequired,
  readonly: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.bool.isRequired,
  onAdjustProgress: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.func.isRequired,
  onAdjustComplete: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.func.isRequired
};
ProgressBar_ProgressBar.defaultProps = {
  readonly: false
};
/* harmony default export */ var src_ProgressBar = (ProgressBar_ProgressBar);
// CONCATENATED MODULE: ./packages/components/src/VideoDisplay.js
function VideoDisplay_extends() { VideoDisplay_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return VideoDisplay_extends.apply(this, arguments); }

function VideoDisplay_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { VideoDisplay_defineProperty(target, key, source[key]); }); } return target; }

function VideoDisplay_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function VideoDisplay_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function VideoDisplay_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }





/* Here is an explanation of the 4 different types of "height"/"width"
 * referenced in this file:
 *   1. imageResolutionX / imageResolutionY
 *     - These are optional props for determining which resolution
 *       we use to display the video. They are assigned to canvas.width
 *       and canvas.height. If one or both are left out, then we use the
 *       video's regular dimensions to figure it out.
 *       We optionally multiply these by the devicePixelRatio to support
 *       hi-DPI (e.g. Retina) displays.
 *   2. realDisplayWidth / realDisplayHeight
 *     - These reflect whatever canvas.width and canvas.height are.
 *       This is different than imageResolutionX / imageResolutionY since
 *       they are actual values and can't be null.
 *   3. containerWidth / containerHeight
 *     - These reflect the actual client offsetWidth and offsetHeight
 *       of the div container around the canvas, in CSS pixels.
 *   4. canvas.style.width / canvas.style.height
 *     - These values are used to scale the canvas's onscreen area.
 *       They form the same ratio as realDisplayWidth / realDisplayHeight
 *       but are adjusted so the canvas maximally fills the container area.
 */
// 'x:y' -> x / y

function extractAspectRatio(aspectRatio) {
  var values = aspectRatio.split(':').map(Number);
  return values[0] / values[1];
}

var defaultBgColor = '#000';
var VideoDisplay_VideoDisplay =
/*#__PURE__*/
function (_PureComponent) {
  VideoDisplay_inheritsLoose(VideoDisplay, _PureComponent);

  function VideoDisplay(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.state = {
      // realDisplayWidth, realDisplayHeight are in canvas display units
      realDisplayWidth: 0,
      realDisplayHeight: 0,
      // containerWidth, containerHeight are in CSS pixel units
      containerWidth: 0,
      containerHeight: 0
    };
    return _this;
  }

  var _proto = VideoDisplay.prototype;

  _proto.componentDidMount = function componentDidMount() {
    // set initial canvas size to 0 to avoid weird layout glitches with
    // the default canvas size (300x150 px in Chrome)
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.checkForBadStuff();

    var _getDeviceDisplayDime = this.getDeviceDisplayDimensions(),
        imageResolutionX = _getDeviceDisplayDime.imageResolutionX,
        imageResolutionY = _getDeviceDisplayDime.imageResolutionY;

    var _props$pipeVideoStrea = this.props.pipeVideoStreamToCanvas(this.canvas, this.handleFrameUpdate.bind(this)),
        endStream = _props$pipeVideoStrea.endStream,
        setCanvasSize = _props$pipeVideoStrea.setCanvasSize,
        setPlaceholderImage = _props$pipeVideoStrea.setPlaceholderImage;

    setCanvasSize(imageResolutionX, imageResolutionY);
    this.getPlaceholderImage(setPlaceholderImage);
    this.endStream = endStream;
    this.setCanvasSize = setCanvasSize;
    this.setPlaceholderImage = setPlaceholderImage;
    this.updateContainerDimensions();
    this.containerResizeObserver = new external_root_ResizeObserver_commonjs_resize_observer_polyfill_commonjs2_resize_observer_polyfill_amd_resize_observer_polyfill_default.a(this.updateContainerDimensions.bind(this));
    this.containerResizeObserver.observe(this.containerElement);
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.checkForBadStuff();

    var _getDeviceDisplayDime2 = this.getDeviceDisplayDimensions(),
        imageResolutionX = _getDeviceDisplayDime2.imageResolutionX,
        imageResolutionY = _getDeviceDisplayDime2.imageResolutionY;

    this.setCanvasSize(imageResolutionX, imageResolutionY);
    this.getPlaceholderImage(this.setPlaceholderImage);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.endStream();
    this.containerResizeObserver.disconnect();
  };

  _proto.checkForBadStuff = function checkForBadStuff() {
    if (!this.warnedAboutBadStuff && this.props.processFrame && !this.props.imageResolutionX && !this.props.imageResolutionY) {
      Object(core_["logWarning"])('VideoDisplay: Supplying a processFrame function without also ' + 'giving a imageResolutionX or imageResolutionY means the video ' + 'will be processed at the full resolution. This may lead to a poor ' + 'framerate.');
      this.warnedAboutBadStuff = true;
    }
  };

  _proto.updateContainerDimensions = function updateContainerDimensions() {
    var _containerElement = this.containerElement,
        offsetWidth = _containerElement.offsetWidth,
        offsetHeight = _containerElement.offsetHeight;
    this.setState(function (state) {
      if (offsetWidth === state.containerWidth && offsetHeight === state.containerHeight) {
        return null;
      }

      return {
        containerWidth: offsetWidth,
        containerHeight: offsetHeight
      };
    });
  };

  _proto.getDeviceDisplayDimensions = function getDeviceDisplayDimensions() {
    var _props = this.props,
        imageResolutionX = _props.imageResolutionX,
        imageResolutionY = _props.imageResolutionY,
        scaleForDevicePixelRatio = _props.scaleForDevicePixelRatio;
    var scale = scaleForDevicePixelRatio && window.devicePixelRatio || 1;
    return {
      imageResolutionX: imageResolutionX && scale * imageResolutionX,
      imageResolutionY: imageResolutionY && scale * imageResolutionY
    };
  };

  _proto.getPlaceholderImage = function getPlaceholderImage(callback) {
    var _props2 = this.props,
        playlist = _props2.playlist,
        activeTrackIndex = _props2.activeTrackIndex,
        getPlaceholderImageForTrack = _props2.getPlaceholderImageForTrack;
    var track = playlist[activeTrackIndex];
    var img = getPlaceholderImageForTrack(track || null);

    if (!img) {
      callback();
    } else if (img.naturalWidth && img.naturalHeight) {
      callback(img);
    } else {
      img.addEventListener('load', function () {
        return callback(img);
      });
      img.addEventListener('error', function () {
        return callback();
      });
    }
  };

  _proto.handleFrameUpdate = function handleFrameUpdate(canvasContext, isVideo) {
    var _canvas = this.canvas,
        width = _canvas.width,
        height = _canvas.height;

    if (width && height) {
      this.setState(function (state) {
        if (width === state.realDisplayWidth && height === state.realDisplayHeight) {
          return null;
        }

        return {
          realDisplayWidth: width,
          realDisplayHeight: height
        };
      });
    }

    if (!(this.props.processFrame && width && height)) {
      return;
    }

    if (!isVideo && !this.props.shouldProcessPlaceholderImages) {
      return;
    }

    var frameData = canvasContext.getImageData(0, 0, width, height);
    var newFrameData = this.props.processFrame(frameData);

    if (newFrameData instanceof ImageData) {
      canvasContext.putImageData(newFrameData, 0, 0);
      return;
    }

    if (!this.warnedAboutNoImageData) {
      Object(core_["logWarning"])('The processFrame function should return an ImageData object. ' + "Normally you'll just mutate the provided ImageData and " + 'return it.');
      this.warnedAboutNoImageData = true;
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _props3 = this.props,
        aspectRatio = _props3.aspectRatio,
        fullscreen = _props3.fullscreen,
        maintainAspectRatioInFullscreen = _props3.maintainAspectRatioInFullscreen,
        attributes = VideoDisplay_objectWithoutProperties(_props3, ["aspectRatio", "fullscreen", "maintainAspectRatioInFullscreen"]);

    delete attributes.pipeVideoStreamToCanvas;
    delete attributes.processFrame;
    delete attributes.imageResolutionX;
    delete attributes.imageResolutionY;
    delete attributes.scaleForDevicePixelRatio;
    delete attributes.playlist;
    delete attributes.activeTrackIndex;
    delete attributes.getPlaceholderImageForTrack;
    delete attributes.shouldProcessPlaceholderImages;
    var _state = this.state,
        realDisplayWidth = _state.realDisplayWidth,
        realDisplayHeight = _state.realDisplayHeight,
        containerWidth = _state.containerWidth,
        containerHeight = _state.containerHeight;
    var canvasStyle = {};

    if (realDisplayWidth && realDisplayHeight && containerWidth && containerHeight) {
      var realDisplayRatio = realDisplayWidth / realDisplayHeight;
      var containerRatio = containerWidth / containerHeight;

      if (realDisplayRatio === containerRatio) {
        canvasStyle.width = containerWidth;
        canvasStyle.height = containerHeight;
      } else if (realDisplayRatio > containerRatio) {
        // video is wider than container - scale with bars on top and bottom
        canvasStyle.width = containerWidth;
        canvasStyle.height = containerWidth / realDisplayRatio;
      } else {
        // video is taller than container - scale with bars on left and right
        canvasStyle.height = containerHeight;
        canvasStyle.width = containerHeight * realDisplayRatio;
      }
    }

    var containerStyle = VideoDisplay_objectSpread({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: defaultBgColor
    }, attributes.style || {});

    if (aspectRatio && containerWidth && (!fullscreen || maintainAspectRatioInFullscreen)) {
      if (containerStyle.height && !this.warnedAboutStyleOverride) {
        Object(core_["logWarning"])('VideoDisplay cannot style.height prop which is ' + 'overridden by aspectRatio.');
        this.warnedAboutStyleOverride = true;
      } // h = w/(x/y)  -->  h*(x/y) = w  -->  x/y = w/h


      containerStyle.height = containerWidth / extractAspectRatio(aspectRatio);
    }

    return external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("div", VideoDisplay_extends({}, attributes, {
      style: containerStyle,
      ref: function ref(elem) {
        return _this2.containerElement = elem;
      }
    }), external_root_React_commonjs_react_commonjs2_react_amd_react_default.a.createElement("canvas", {
      style: canvasStyle,
      ref: function ref(elem) {
        return _this2.canvas = elem;
      }
    }));
  };

  return VideoDisplay;
}(external_root_React_commonjs_react_commonjs2_react_amd_react_["PureComponent"]);
VideoDisplay_VideoDisplay.propTypes = {
  pipeVideoStreamToCanvas: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.func.isRequired,
  playlist: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.arrayOf(core_["PlayerPropTypes"].track.isRequired).isRequired,
  activeTrackIndex: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.number.isRequired,
  fullscreen: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.bool,

  /* TODO: for documentation
  We might want to use this grayscale function in an example
    processFrame: function (frameData) {
      for (let i = 0; i < frameData.data.length; i += 4) {
        const r = frameData.data[i + 0];
        const g = frameData.data[i + 1];
        const b = frameData.data[i + 2];
         // convert to simple grayscale
        const average = (r + g + b) / 3;
        frameData.data[i + 0] = average;
        frameData.data[i + 1] = average;
        frameData.data[i + 2] = average;
      }
      return frameData;
    }
  */
  processFrame: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.func,
  imageResolutionX: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.number,
  imageResolutionY: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.number,
  scaleForDevicePixelRatio: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.bool.isRequired,
  aspectRatio: core_["PlayerPropTypes"].aspectRatio,
  getPlaceholderImageForTrack: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.func.isRequired,
  shouldProcessPlaceholderImages: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.bool.isRequired,
  maintainAspectRatioInFullscreen: external_root_PropTypes_commonjs_prop_types_commonjs2_prop_types_amd_prop_types_default.a.bool.isRequired
};
VideoDisplay_VideoDisplay.defaultProps = {
  scaleForDevicePixelRatio: true,
  aspectRatio: '16:9',
  getPlaceholderImageForTrack: function getPlaceholderImageForTrack(track) {
    if (track && track.artwork) {
      var img = new Image();
      img.src = track.artwork[0].src;
      return img;
    }
  },
  shouldProcessPlaceholderImages: false,
  maintainAspectRatioInFullscreen: false
};
/* harmony default export */ var src_VideoDisplay = (Object(core_["playerContextFilter"])(VideoDisplay_VideoDisplay, ['pipeVideoStreamToCanvas', 'playlist', 'activeTrackIndex', 'fullscreen']));
// CONCATENATED MODULE: ./packages/components/src/index.js
/* concated harmony reexport MaybeMarquee */__webpack_require__.d(__webpack_exports__, "MaybeMarquee", function() { return src_MaybeMarquee; });
/* concated harmony reexport ProgressBar */__webpack_require__.d(__webpack_exports__, "ProgressBar", function() { return src_ProgressBar; });
/* concated harmony reexport ProgressBarDisplay */__webpack_require__.d(__webpack_exports__, "ProgressBarDisplay", function() { return src_ProgressBarDisplay; });
/* concated harmony reexport VideoDisplay */__webpack_require__.d(__webpack_exports__, "VideoDisplay", function() { return src_VideoDisplay; });









/***/ })
/******/ ]);
});
//# sourceMappingURL=cassette-components.js.map