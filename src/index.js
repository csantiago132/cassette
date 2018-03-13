import AudioPlayer from './AudioPlayer';
import PlayerContext from './PlayerContext';
import { renderPlayPauseButton } from './controls/PlayPauseButton';
import { renderBackSkipButton } from './controls/BackSkipButton';
import { renderForwardSkipButton } from './controls/ForwardSkipButton';
import { renderVolumeControl } from './controls/VolumeControl';
import { renderRepeatButton } from './controls/RepeatButton';
import { renderShuffleButton } from './controls/ShuffleButton';
import { renderAudioProgress } from './controls/AudioProgress';
import ProgressBar from './controls/common/ProgressBar';
import ProgressBarDisplay from './controls/common/ProgressBarDisplay';

export default AudioPlayer;
export { AudioPlayer };
export const PlayerContextProvider = AudioPlayer;
export const PlayerContextConsumer = PlayerContext.Consumer;
export { renderPlayPauseButton };
export { renderBackSkipButton };
export { renderForwardSkipButton };
export { renderVolumeControl };
export { renderRepeatButton };
export { renderShuffleButton };
export { renderAudioProgress };
export { ProgressBar };
export { ProgressBarDisplay };

// for browser script tag (global var) usage
AudioPlayer.PlayerContextProvider = AudioPlayer;
AudioPlayer.PlayerContextConsumer = PlayerContext.Consumer;
AudioPlayer.renderPlayPauseButton = renderPlayPauseButton;
AudioPlayer.renderBackSkipButton = renderBackSkipButton;
AudioPlayer.renderForwardSkipButton = renderForwardSkipButton;
AudioPlayer.renderVolumeControl = renderVolumeControl;
AudioPlayer.renderRepeatButton = renderRepeatButton;
AudioPlayer.renderShuffleButton = renderShuffleButton;
AudioPlayer.renderAudioProgress = renderAudioProgress;
AudioPlayer.ProgressBar = ProgressBar;
AudioPlayer.ProgressBarDisplay = ProgressBarDisplay;
