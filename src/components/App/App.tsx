import { EquipmentProperties, PlaceInfo, PlaceProperties } from '@sozialhelden/a11yjson';
import 'focus-visible';
import findIndex from 'lodash/findIndex';
import includes from 'lodash/includes';
import * as queryString from 'query-string';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { PlaceDetailsProps } from '../app/PlaceDetailsProps';
import { trackModalView } from '../../lib/Analytics';
import config from '../../lib/config';
import { trackingEventBackend } from '../../lib/data-fetching/TrackingEventBackend';
import { getFeatureId, isAccessibilityFiltered, isToiletFiltered } from '../lib/Feature';
import '../../lib/NativeAppStrings';
import savedState, { isFirstStart, saveState } from '../../lib/savedState';
import { SearchResultFeature } from '../../lib/searchPlaces';
import { isTouchDevice } from '../../lib/userAgent';
import { hasBigViewport } from '../../lib/ViewportSize';
import MainView, { UnstyledMainView } from './MainView';
import { Cluster } from '../Map/Cluster';
import { PlaceFilter } from '../SearchToolbar/AccessibilityFilterModel';

interface Props extends PlaceDetailsProps {
  className?: string;
}

interface State {
  isMainMenuOpen: boolean;
  isSearchBarVisible: boolean;
  isOnSmallViewport: boolean;
  isSearchToolbarExpanded: boolean;
}

function isStickySearchBarSupported() {
  return hasBigViewport() && !isTouchDevice();
}

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #6c7374;
  }

  body {
    position: fixed;
    overscroll-behavior: none;
  }

  html,
  body {
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body,
  #__next,
  .main-view {
    top: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
  }

  /*
      This will hide the focus indicator if the element receives focus via the mouse,
      but it will still show up on keyboard focus.
    */

  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }

  /*
      We use a stronger and consistent focus indicator when an element receives focus via
      keyboard.
    */

  .js-focus-visible .focus-visible {
    outline: none;
    box-shadow: inset 0px 0px 0px 2px #4469e1;
    transition: box-shadow 0.2s;
  }

  .radio-group:focus-within,
  [role="radiogroup"]:focus-within {
    box-shadow: 0px 0px 0px 2px #4469e1;
    transition: box-shadow 0.2s;
  }

  .sr-only {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .subtle {
    opacity: 0.6;
  }

  body,
  button,
  input,
  select,
  textarea {
    /* Mix of the two system font stacks used by GitHub and Medium. */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  kbd {
    background-color: transparent;
    border-radius: 3px;
    border: 1px solid #b4b4b4;
    color: rgba(255, 255, 255, 0.8);
    display: inline-block;
    line-height: 1;
    padding: 2px 4px;
    margin-left: 3px;
    margin-right: 3px;
    white-space: nowrap;
  }
`;

class App extends React.Component<Props, State> {
  props: Props;

  state: State = {
    lat: null,
    lon: null,
    isSpecificLatLonProvided: false,
    zoom: null,
    isSearchBarVisible: isStickySearchBarSupported(),
    isMainMenuOpen: false,
    modalNodeState: null,
    isOnSmallViewport: false,
    isSearchToolbarExpanded: false,
  };

  map: any;

  mainView: UnstyledMainView;

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
    const newState: Partial<State> = {
      isSearchToolbarExpanded: false,
      isSearchBarVisible: isStickySearchBarSupported(),
    };

    const parsedZoom = typeof props.zoom === 'string' ? parseInt(props.zoom, 10) : null;
    const parsedLat = typeof props.lat === 'string' ? parseFloat(props.lat) : null;
    const parsedLon = typeof props.lon === 'string' ? parseFloat(props.lon) : null;

    newState.extent = state.extent || props.extent || null;
    newState.zoom =
      state.zoom || parsedZoom || Number.parseInt(savedState.map.lastZoom, 10) || null;
    newState.lat =
      state.lat ||
      parsedLat ||
      (savedState.map.lastCenter && Number.parseFloat(savedState.map.lastCenter[0])) ||
      null;
    newState.lon =
      state.lon ||
      parsedLon ||
      (savedState.map.lastCenter && Number.parseFloat(savedState.map.lastCenter[1])) ||
      null;

    newState.isSpecificLatLonProvided = Boolean(parsedLat) && Boolean(parsedLon);

    return newState;
  }

  componentDidMount() {
    const { routeName, inEmbedMode } = this.props;

    const shouldStartInSearch = routeName === 'map' && !inEmbedMode;

    if (isFirstStart()) {
      this.setState({ isOnboardingVisible: true });
    } else if (shouldStartInSearch) {
      this.openSearch(true);
    }

    trackingEventBackend.track(this.props.app, {
      type: 'AppOpened',
      query: queryString.parse(window.location.search),
    });
  }

  onToggleMainMenu = (isMainMenuOpen: boolean) => {
    this.setState({ isMainMenuOpen });
  };

  onMoveEnd = (state: Partial<State>) => {
    let { zoom, lat, lon } = state;

    // Adjust zoom level to be stored in the local storage to make sure the user can
    // see some places when reloading the app after some time.
    const lastZoom = String(
      Math.max(zoom || 0, config.minZoomWithSetCategory, config.minZoomWithoutSetCategory)
    );

    saveState({
      'map.lastZoom': lastZoom,
      'map.lastCenter.lat': String(lat),
      'map.lastCenter.lon': String(lon),
      'map.lastMoveDate': new Date().toString(),
    });

    this.setState({ extent: null, lat, lon, zoom });
  };

  onMapClick = () => {
    if (this.state.isSearchToolbarExpanded) {
      this.closeSearch();
      this.mainView && this.mainView.focusMap();
    }
  };

  showSelectedFeature = (
    featureId: string | number,
    properties?: PlaceProperties | EquipmentProperties | null
  ) => {
    if (!featureId) {
      debugger;
    }
    const featureIdString = featureId.toString();
    const { routerHistory } = this.props;

    // show equipment inside their place details
    let routeName = 'placeDetail';
    const params = this.getCurrentParams() as any;

    params.id = featureIdString;
    delete params.eid;

    if (['elevator', 'escalator'].includes(properties.category) && properties.placeInfoId) {
      const placeInfoId = properties.placeInfoId;
      if (includes(['elevator', 'escalator'], properties.category)) {
        routeName = 'equipment';
        params.id = placeInfoId;
        params.eid = featureIdString;
      }
    }

    let activeCluster = null;
    if (this.state.activeCluster) {
      const index = findIndex(
        this.state.activeCluster.features,
        // @ts-ignore
        f => (f.id || f._id) === featureIdString
      );
      activeCluster = index !== -1 ? this.state.activeCluster : null;
    }

    this.setState({ activeCluster }, () => {
      routerHistory.push(routeName, params);
    });
  };

  onClickFullscreenBackdrop = () => {
    this.setState({ isMainMenuOpen: false, isOnboardingVisible: false, modalNodeState: null });
    trackModalView(null);
    this.onCloseNodeToolbar();
  };

  render() {
    const { isSpecificLatLonProvided } = this.state;
    const isNodeRoute = Boolean(this.props.featureId);

    const mapMoveDate = savedState.map.lastMoveDate;
    const wasMapMovedRecently = mapMoveDate && +new Date() - +mapMoveDate < config.locateTimeout;
    const shouldLocateOnStart = !isSpecificLatLonProvided && !isNodeRoute && !wasMapMovedRecently;
    const isSearchBarVisible = this.state.isSearchBarVisible;

    return (
      <>
        <GlobalStyle />
        <MainView
          {...extraProps}
          ref={mainView => {
            this.mainView = mainView;
          }}
        />
      </>
    );
  }
}

export default App;
