function findTrackIndexByUrl (playlist, url) {
  return playlist.findIndex(track => url === track.url);
}

export default findTrackIndexByUrl;
