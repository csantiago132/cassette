function isPlaylistValid (playlist) {
  return Boolean(playlist && playlist.length);
}

module.exports = isPlaylistValid;
