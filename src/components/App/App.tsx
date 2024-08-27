import { EquipmentProperties, PlaceProperties } from '@sozialhelden/a11yjson';
import 'focus-visible';
import findIndex from 'lodash/findIndex';
import includes from 'lodash/includes';
import * as React from 'react';
import { isTouchDevice } from '../../lib/context/UserAgentContext';
import { PlaceDetailsProps } from '../../lib/fetchers/legacy/PlaceDetailsProps';
import { hasBigViewport } from '../../lib/util/ViewportSize';
import config from '../../lib/util/config';
import savedState, { saveState } from '../../lib/util/savedState';
import '../../lib/util/strings/NativeAppStrings';
import GlobalStyle from './GlobalAppStyle';

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
    newState.zoom = state.zoom
      || parsedZoom
      || Number.parseInt(savedState.map.lastZoom, 10)
      || null;
    newState.lat = state.lat
      || parsedLat
      || (savedState.map.lastCenter
        && Number.parseFloat(savedState.map.lastCenter[0]))
      || null;
    newState.lon = state.lon
      || parsedLon
      || (savedState.map.lastCenter
        && Number.parseFloat(savedState.map.lastCenter[1]))
      || null;

    newState.isSpecificLatLonProvided = Boolean(parsedLat) && Boolean(parsedLon);

    return newState;
  }

  onMoveEnd = (state: Partial<State>) => {
    const { zoom, lat, lon } = state;

    // Adjust zoom level to be stored in the local storage to make sure the user can
    // see some places when reloading the app after some time.
    const lastZoom = String(
      Math.max(
        zoom || 0,
        config.minZoomWithSetCategory,
        config.minZoomWithoutSetCategory,
      ),
    );

    saveState({
      'map.lastZoom': lastZoom,
      'map.lastCenter.lat': String(lat),
      'map.lastCenter.lon': String(lon),
      'map.lastMoveDate': new Date().toString(),
    });

    this.setState({
      extent: null, lat, lon, zoom,
    });
  };

  onMapClick = () => {
    if (this.state.isSearchToolbarExpanded) {
      this.closeSearch();
      this.mainView && this.mainView.focusMap();
    }
  };

  showSelectedFeature = (
    featureId: string | number,
    properties?: PlaceProperties | EquipmentProperties | null,
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

    if (
      ['elevator', 'escalator'].includes(properties.category)
      && properties.placeInfoId
    ) {
      const { placeInfoId } = properties;
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
        (f) => (f.id || f._id) === featureIdString,
      );
      activeCluster = index !== -1 ? this.state.activeCluster : null;
    }

    this.setState({ activeCluster }, () => {
      routerHistory.push(routeName, params);
    });
  };

  render() {
    const { isSpecificLatLonProvided } = this.state;
    const isNodeRoute = Boolean(this.props.featureId);
    const mapMoveDate = savedState.map.lastMoveDate;
    const wasMapMovedRecently = mapMoveDate && +new Date() - +mapMoveDate < config.locateTimeout;
    const shouldLocateOnStart = !isSpecificLatLonProvided && !isNodeRoute && !wasMapMovedRecently;
    const { isSearchBarVisible } = this.state;

    return (
      <>
        <GlobalStyle />
        <MainView
          {...extraProps}
          ref={(mainView) => {
            this.mainView = mainView;
          }}
        />
      </>
    );
  }
}

export default App;
