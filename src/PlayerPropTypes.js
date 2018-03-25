import PropTypes from 'prop-types';

import { repeatStrategyOptions } from './constants';

export const controlKeyword = PropTypes.oneOf([
  'playpause',
  'backskip',
  'forwardskip',
  'volume',
  'repeat',
  'shuffle',
  'progress',
  'progressdisplay',
  'spacer'
]);

export const control = PropTypes.oneOfType([PropTypes.func, controlKeyword]);

export const crossOriginAttribute = PropTypes.oneOf([
  'anonymous',
  'use-credentials'
]);

export const repeatStrategy = PropTypes.oneOf(repeatStrategyOptions);

export const audioSource = PropTypes.shape({
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
});

export const trackUrl = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(audioSource.isRequired)
]);

export const mediaSessionAction = PropTypes.oneOf([
  'play',
  'pause',
  'previoustrack',
  'nexttrack',
  'seekbackward',
  'seekforward'
]);

export const mediaSessionArtwork = PropTypes.shape({
  src: PropTypes.string.isRequired,
  sizes: PropTypes.string,
  type: PropTypes.string
});

export const track = PropTypes.shape({
  url: trackUrl.isRequired,
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  album: PropTypes.string,
  artwork: PropTypes.arrayOf(mediaSessionArtwork.isRequired),
  meta: PropTypes.object
});

export const progressDirection = PropTypes.oneOf([
  'left',
  'right',
  'up',
  'down'
]);
