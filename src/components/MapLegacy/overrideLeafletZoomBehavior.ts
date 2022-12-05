import L from 'leaflet';

let lastScroll = new Date().getTime();

export default function overrideLeafletZoomBehavior() {
  L.Map.ScrollWheelZoom.prototype._onWheelScroll = function(e) {
    if (new Date().getTime() - lastScroll < 400) {
      return;
    }
    const delta = L.DomEvent.getWheelDelta(e);
    const debounce = this._map.options.wheelDebounceTime;

    this._delta += delta;
    this._lastMousePos = this._map.mouseEventToContainerPoint(e);

    if (!this._startTime) {
      this._startTime = +new Date();
    }

    const left = Math.max(debounce - (+new Date() - this._startTime), 0);

    clearTimeout(this._timer);
    lastScroll = new Date().getTime();
    this._timer = setTimeout(L.bind(this._performZoom, this), left);

    L.DomEvent.stop(e);
  };
}
