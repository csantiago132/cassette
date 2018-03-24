import isPlaylistValid from './isPlaylistValid';

function getTrackSrc (playlist, index) {
  const url = isPlaylistValid(playlist) && (playlist[index] || {}).url || '';
  return url.constructor === Array && url.length ? url : [{ src: url }];
}

export default getTrackSrc;
