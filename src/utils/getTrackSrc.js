import isPlaylistValid from './isPlaylistValid';

function getTrackSrc (playlist, index) {
  return isPlaylistValid(playlist) && (playlist[index] || {}).url || '';
}

export default getTrackSrc;
