// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import { userAgent } from '../../lib/userAgent';
import colors from '../../lib/colors';
import {
  generateOsmNoteUrlForCoords,
  generateOsmEditorUrlForCoords,
} from '../../lib/generateOsmUrls';
import Toolbar from '../Toolbar';
import ChevronRight from '../ChevronRight';
import CloseLink from './CloseButton';
import goMapIcon from './goMap.png';
import idEditorIcon from './idEditor.png';
import mapsMeForAndroidIcon from './mapsMeForAndroid.png';
import mapsMeForIOSIcon from './mapsMeForIOS.jpg';
import vespucciIcon from './vespucci.png';

export type Props = {
  hidden: boolean,
  onClose: ?() => void,
  lat: ?string,
  lon: ?string,
};

const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;

  h2, h3 {
    font-weight: bold;
    font-size: 1rem;
    flex: 1;
  }

  > header {
    position: sticky;
    display: flex;
    flex-direction: row;
    align-items: center;
    top: 0;
    height: 50px;
    min-height: 50px;
    z-index: 1;
    border-bottom: 1px ${colors.borderColor} solid;
    padding-left: 1rem;
  }

  > section {
    overflow: auto;
    padding: 0 1rem 10px 1rem;

    ul, li {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    .link-button {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        flex: 1;
      }
    }

    .leave-note-button {
      margin: 2rem -10px;
    }
  }
`;

const AppIcon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
`;

type App = { title: string, href: string, icon: string };
type AppFunction = (coords?: { lat: ?string, lon: ?string }) => App;

const apps: { [key: string]: AppFunction } = {
  vespucci: () => ({
    title: t`“Vespucci” in PlayStore`,
    href: 'https://play.google.com/store/apps/details?id=de.blau.android',
    icon: vespucciIcon,
  }),
  idEditor: coords => ({
    title: t`Use the OpenStreetMap web editor`,
    href: generateOsmEditorUrlForCoords(coords),
    icon: idEditorIcon,
  }),
  goMap: () => ({
    title: t`“Go Map!!” in App Store`,
    href: 'https://itunes.apple.com/us/app/go-map/id592990211?mt=8',
    icon: goMapIcon,
  }),
  mapsMeForIOS: () => ({
    title: t`“MAPS.ME” in App Store`,
    href: 'https://itunes.apple.com/app/id510623322',
    icon: mapsMeForIOSIcon,
  }),
  mapsMeForAndroid: () => ({
    title: t`“MAPS.ME” in PlayStore`,
    href: 'https://play.google.com/store/apps/details?id=com.mapswithme.maps.pro',
    icon: mapsMeForAndroidIcon,
  }),
};

export default class CreatePlaceDialog extends React.Component<Props> {
  props: Props;

  addPlaceLink: ?HTMLLinkElement;
  closeLink: ?HTMLLinkElement;

  componentDidMount() {
    if (!this.props.hidden) {
      this.focus();
    }
  }

  focus() {}

  appLinks() {
    const { lat, lon } = this.props;

    const appLinks: App[] = [];
    if (userAgent.os.name === 'iOS') {
      appLinks.push(apps.mapsMeForIOS());
      appLinks.push(apps.goMap());
    }
    if (userAgent.os.name === 'Android') {
      appLinks.push(apps.mapsMeForAndroid());
      appLinks.push(apps.vespucci());
    }
    appLinks.push(apps.idEditor({ lat, lon }));
    return appLinks;
  }

  renderAppLinkListElements() {
    return this.appLinks().map(link => (
      <li key={link.title}>
        <a className="link-button" href={link.href} target="_blank" rel="noopener noreferrer">
          <AppIcon src={link.icon} alt="" aria-hidden />
          <span>{link.title}</span>
          <ChevronRight color={colors.linkColor} />
        </a>
      </li>
    ));
  }

  render() {
    const { lat, lon } = this.props;

    const className = ['add-place-dialog', this.props.isExpanded && 'is-expanded']
      .filter(Boolean)
      .join(' ');

    const header = t`Add a new place`;
    const explanation = t`Most places shown here are from <a href='https://openstreetmap.org'>OpenStreetMap (OSM)</a>. If you add places on OSM, they will appear here a bit later.`;
    const leaveANoteCaption = t`Leave a note on OpenStreetMap`;
    const addOSMPlaceHeader = t`Add a place on OpenStreetMap`;

    return (
      <StyledToolbar className={className} hidden={this.props.hidden} isModal>
        <header>
          <h2>{header}</h2>
          <CloseLink onClick={this.props.onClose} />
        </header>
        <section>
          <p dangerouslySetInnerHTML={{ __html: explanation }} />
          <a
            className="link-button leave-note-button"
            href={generateOsmNoteUrlForCoords({ lat, lon })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{leaveANoteCaption}</span>
            <ChevronRight color={colors.linkColor} />
          </a>
          <h3>{addOSMPlaceHeader}</h3>
          <ul>{this.renderAppLinkListElements()}</ul>
        </section>
      </StyledToolbar>
    );
  }
}
