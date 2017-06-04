function getSourceList (playlist) {
  return (playlist || []).map(track => track.url);
}

module.exports = getSourceList;
