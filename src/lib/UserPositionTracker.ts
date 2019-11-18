import { shouldLocate, addListener } from './savedState';

/**
 * The UserPositionTracker allows tracking changes to the user position.
 * It respects the global setting for tracking on the map, and only
 * collects positions while it is turned on.
 */
export default class UserPositionTracker {
  constructor() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }
    addListener(this.handleStorageChange);
    this.handleStorageChange();
  }

  handleStorageChange = () => {
    if (shouldLocate()) {
      this.start();
    } else {
      this.stop();
    }
  };

  start() {
    if (this._watch) {
      return;
    }

    this._watch = navigator.geolocation.watchPosition(
      position => {
        this.userLocation = position;
      },
      error => {
        this.userLocation = null;
      }
    );
  }

  stop() {
    if (this._watch === null) {
      return;
    }
    navigator.geolocation.clearWatch(this._watch);
    this._watch = null;
    this.userLocation = null;
  }

  userLocation: Position | null = null;

  // private
  _watch: number | null = null;
}

export const userPositionTracker = new UserPositionTracker();
