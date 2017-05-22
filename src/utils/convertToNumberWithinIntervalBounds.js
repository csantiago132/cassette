function convertToNumberWithinIntervalBounds (number, min, max) {
  return Math.max(min, Math.min(number, max));
}

module.exports = convertToNumberWithinIntervalBounds;
