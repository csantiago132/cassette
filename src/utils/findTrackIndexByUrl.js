import arrayFindIndex from 'array-find-index';

function findTrackIndexByUrl (playlist, url) {
  return arrayFindIndex(playlist, track => {
    return track.url && (
      track.url.constructor === Array
        ? track.url.findIndex(source => source.src === url) !== -1
        : url === track.url
    );
  });
}

export default findTrackIndexByUrl;
