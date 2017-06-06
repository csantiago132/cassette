import arrayFindIndex from 'array-find-index';

function findTrackIndexByUrl (playlist, url) {
  return arrayFindIndex(playlist, track => track.url && url === track.url);
}

export default findTrackIndexByUrl;
