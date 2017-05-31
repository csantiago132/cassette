function getRepeatStrategy (loop, cycle) {
  if (loop) {
    return 'track';
  }
  if (cycle) {
    return 'playlist';
  }
  return 'none';
}

module.exports = getRepeatStrategy;
