function stopPropagation (e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

module.exports = stopPropagation;
