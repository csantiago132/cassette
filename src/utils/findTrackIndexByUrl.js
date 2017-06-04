function findTrackIndexByUrl (playlist, url) {
  return playlist.findIndex(track => url === track.url);
}

module.exports = findTrackIndexByUrl;
