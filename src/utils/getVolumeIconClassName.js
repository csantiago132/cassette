function getVolumeIconClassName (volume, muted) {
  if (muted) {
    return 'icono-volumeMute';
  }
  if (volume === 0) {
    return 'icono-volume';
  }
  if (volume <= 1 / 3) {
    return 'icono-volumeLow';
  }
  if (volume <= 2 / 3) {
    return 'icono-volumeMedium';
  }
  return 'icono-volumeHigh';
}

export default getVolumeIconClassName;
