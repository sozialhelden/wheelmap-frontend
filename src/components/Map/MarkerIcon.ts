import L, { IconOptions } from 'leaflet';
import ReactDOM from 'react-dom';

type Options = IconOptions & {
  href: string,
  onClick: () => void,
  iconAnchorOffset: L.Point,
};

export default class MarkerIcon extends L.Icon {
  constructor(options: Options) {
    // increased tap region for icons, rendered size might differ
    const size = 40;
    const { iconAnchorOffset, onClick, href, highlighted, accessibleName } = options;
    const leafletOptions = {
      iconSize: new L.Point(size, size),
      iconAnchor: new L.Point(size * 0.5 + iconAnchorOffset.x, size * 0.5 + iconAnchorOffset.y),
      className: `marker-icon${highlighted ? ' highlighted-marker' : ''}`,
    };

    super(leafletOptions);

    this.onClick = onClick;
    this.href = href;
    this.highlighted = highlighted;
    this.accessibleName = accessibleName;
  }

  createIcon() {
    const link = document.createElement('a');
    link.href = this.href;

    if (this.iconSvgElement) {
      ReactDOM.render(this.iconSvgElement, link);
    }
    link.style.touchAction = 'none';

    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.onClick();
    });
    this._setIconStyles(link, 'icon');

    link.setAttribute('aria-label', this.accessibleName);
    return link;
  }
}
