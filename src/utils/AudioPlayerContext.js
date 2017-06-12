// based on:
// https://gist.github.com/mweststrate/2b82a0ec6828dbbb50032ee7635e0d95

class AudioPlayerContext {
  constructor (controlProps) {
    this.controlProps = controlProps;
    this._subscriptions = [];
  }

  setControlProps (controlProps) {
    this.controlProps = controlProps;
  }

  notifySubscribers () {
    this._subscriptions.forEach(f => f());
  }

  subscribe (f) {
    const index = this._subscriptions.indexOf(f);
    if (index === -1) {
      this._subscriptions.push(f);
    }
    return () => this._unsubscribe(f);
  }

  _unsubscribe (f) {
    const index = this._subscriptions.indexOf(f);
    if (index !== -1) {
      this._subscriptions.splice(index, 1);
    }
  }
}

export default AudioPlayerContext;
