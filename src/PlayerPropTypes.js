import PropTypes from 'prop-types';

import { repeatStrategyOptions } from './constants';
import { logWarning } from './utils/console';

function requiredOnlyUnlessHasProp (propType, altPropName) {
  let warnedAboutDefiningBoth = false;
  function validate (props, propName, componentName, ...rest) {
    if (propName in props) {
      if (!warnedAboutDefiningBoth && altPropName in props) {
        logWarning(
          `Do not define both the '${propName}' and '${altPropName}' props.`
        );
        warnedAboutDefiningBoth = true;
      }
      return propType.isRequired(props, propName, componentName, ...rest);
    }
    if (!(altPropName in props)) {
      return new Error(
        `If the '${altPropName}' prop is not defined, '${propName}' must be.`
      );
    }
  }
  return validate;
}

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
  url: requiredOnlyUnlessHasProp(PropTypes.string, 'sources'),
  sources: requiredOnlyUnlessHasProp(
    PropTypes.arrayOf(audioSource.isRequired),
    'url'
  ),
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
