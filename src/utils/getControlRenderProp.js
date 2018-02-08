import { renderPlayPauseButton } from '../controls/PlayPauseButton';
import { renderBackSkipButton } from '../controls/BackSkipButton';
import { renderForwardSkipButton } from '../controls/ForwardSkipButton';
import { renderVolumeControl } from '../controls/VolumeControl';
import { renderRepeatButton } from '../controls/RepeatButton';
import { renderShuffleButton } from '../controls/ShuffleButton';
import { renderAudioProgress } from '../controls/AudioProgress';
import { renderAudioProgressDisplay } from '../controls/AudioProgressDisplay';
import { renderSpacer } from '../controls/Spacer';

function getControlRenderProp (control) {
  if (typeof control === 'function') {
    return control;
  }
  if (typeof control === 'string') {
    switch (control) {
      case 'playpause':
        return renderPlayPauseButton;
      case 'backskip':
        return renderBackSkipButton;
      case 'forwardskip':
        return renderForwardSkipButton;
      case 'volume':
        return renderVolumeControl;
      case 'repeat':
        return renderRepeatButton;
      case 'shuffle':
        return renderShuffleButton;
      case 'progress':
        return renderAudioProgress;
      case 'progressdisplay':
        return renderAudioProgressDisplay;
      case 'spacer':
        return renderSpacer;
      default:
        return null;
    }
  }
  return null;
}

export default getControlRenderProp;
