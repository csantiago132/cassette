import PlayPauseButton from '../controls/PlayPauseButton';
import BackSkipButton from '../controls/BackSkipButton';
import ForwardSkipButton from '../controls/ForwardSkipButton';
import VolumeControl from '../controls/VolumeControl';
import AudioProgress from '../controls/AudioProgress';
import AudioProgressDisplay from '../controls/AudioProgressDisplay';
import Spacer from '../controls/Spacer';

function getControlComponent (control) {
  if (typeof control === 'function') {
    return control;
  }
  if (typeof control === 'string') {
    switch (control) {
      case 'playpause':
        return PlayPauseButton;
      case 'backskip':
        return BackSkipButton;
      case 'forwardskip':
        return ForwardSkipButton;
      case 'volume':
        return VolumeControl;
      case 'progress':
        return AudioProgress;
      case 'progressdisplay':
        return AudioProgressDisplay;
      case 'spacer':
        return Spacer;
      default:
        return null;
    }
  }
  return null;
}

module.exports = getControlComponent;
