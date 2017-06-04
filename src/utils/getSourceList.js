function getSourceList (playlist) {
  return (playlist || []).map(track => track.url);
}

export default getSourceList;
