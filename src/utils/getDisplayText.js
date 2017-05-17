import isPlaylistValid from './isPlaylistValid';

function getDisplayText (playlist, activeTrackIndex) {
  if (!isPlaylistValid(playlist)) {
    return 'Please load a playlist';
  }
  return activeTrackIndex < 0 ? null : playlist[activeTrackIndex].displayText;
}

module.exports = getDisplayText;
