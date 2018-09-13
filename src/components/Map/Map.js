// @flow

import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster-src';
import { t } from 'ttag';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import * as React from 'react';
import SozialheldenLogo from './SozialheldenLogo';
import { currentLocales, loadExistingLocalizationByPreference } from '../../lib/i18n';
import LeafletLocateControl from './L.Control.Locate';
import HighlightableMarker from './HighlightableMarker';
import { isWheelmapFeature } from '../../lib/Feature';
import { CategoryStrings as EquipmentCategoryStrings } from '../../lib/EquipmentInfo';

import {
  isWheelchairAccessible,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
  hasAccessibleToilet,
  wheelmapFeatureCollectionFromResponse,
  accessibilityCloudFeatureCollectionFromResponse,
  getFeatureId,
} from '../../lib/Feature';
import ClusterIcon from './ClusterIcon';
import Categories from '../../lib/Categories';
import isSamePosition from './isSamePosition';
import GeoJSONTileLayer from './GeoJSONTileLayer';
import addLocateControlToMap from './addLocateControlToMap';
import goToLocationSettings from '../../lib/goToLocationSettings';
import highlightMarkers from './highlightMarkers';
import overrideLeafletZoomBehavior from './overrideLeafletZoomBehavior';
import type { Feature, YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import { normalizeCoordinate, normalizeCoordinates } from '../../lib/normalizeCoordinates';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../lib/cache/WheelmapLightweightFeatureCache';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';
import { globalFetchManager } from '../../lib/FetchManager';
import { userAgent } from '../../lib/userAgent';
import NotificationButton from './NotificationButton';
import { hasOpenedLocationHelp, saveState } from '../../lib/savedState';
import colors from '../../lib/colors';
import useImperialUnits from '../../lib/useImperialUnits';

window.L = L;

type Padding = { top: number, left: number, right: number, bottom: number };
type MoveArgs = { zoom: number, lat: number, lon: number, bbox: L.LatLngBounds };

type Props = {
  featureId?: ?string,
  feature?: ?Feature,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  onMoveEnd?: (args: MoveArgs) => void,
  onClick?: () => void,
  onError?: (error: ?Error | string) => void,
  category: ?string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  hrefForFeature: (
    featureId: string,
    properties: ?NodeProperties | EquipmentInfoProperties
  ) => string,
  accessibilityCloudTileUrl: () => string,
  accessibilityCloudAppToken: string,
  accessibilityCloudBaseUrl: string,
  wheelmapApiBaseUrl: string,
  wheelmapApiKey: string,
  mapboxTileUrl: string,
  maxZoom: number,
  minZoomWithSetCategory: number,
  minZoomWithoutSetCategory: number,
  defaultStartCenter: [number, number],
  pointToLayer: (feature: Feature, latlng: [number, number]) => ?L.Marker,
  locateOnStart?: boolean,
  padding: ?Padding,
  className: ?string,
  onMapMounted?: (map: L.Map) => void,
  unitSystem?: 'metric' | 'imperial',
  isLocalizationLoaded: boolean,
  hideHints?: boolean,
  onLocationError: (error: any) => void,
};

type State = {
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  showZoomInfo?: boolean,
  showLocationNotAllowedHint: boolean,
};

overrideLeafletZoomBehavior();

export default class Map extends React.Component<Props, State> {
  props: Props;
  state: State = {
    accessibilityFilter: [].concat(yesNoLimitedUnknownArray),
    toiletFilter: [].concat(yesNoUnknownArray),
    showLocationNotAllowedHint: false,
  };
  lastFeatureId: ?string;
  map: ?L.Map;
  mapElement: ?HTMLElement;
  featureLayer: ?L.LayerGroup;
  wheelmapTileLayer: ?GeoJSONTileLayer;
  accessibilityCloudTileLayer: ?GeoJSONTileLayer;
  highLightLayer: ?L.Layer;
  locateControl: ?LeafletLocateControl;
  mapHasBeenMoved: boolean = false;

  onMoveEnd() {
    this.mapHasBeenMoved = true;
    const map = this.map;
    if (!map) return;
    const { lat, lng } = map.getCenter();
    const zoom = map.getZoom();

    const onMoveEnd = this.props.onMoveEnd;
    if (typeof onMoveEnd === 'function') {
      const bbox = map.getBounds();
      onMoveEnd({ lat: normalizeCoordinate(lat), lon: normalizeCoordinate(lng), zoom, bbox });
    }

    const minimalZoomLevelForFeatures = this.props.category
      ? this.props.minZoomWithSetCategory
      : this.props.minZoomWithoutSetCategory;
    const showZoomInfo = this.map ? this.map.getZoom() < minimalZoomLevelForFeatures : false;
    this.setState({ showZoomInfo });

    this.updateTabIndexes();
  }

  updateTabIndexes() {
    const map = this.map;
    if (!map) return;
    map.eachLayer(layer => {
      if (layer.getElement && layer.getLatLng) {
        const isInViewport = map.getBounds().contains(layer.getLatLng());
        const layerElement = layer.getElement();
        layerElement.setAttribute('tabindex', isInViewport ? 0 : -1);
      }
    });
  }

  createMarkerClusterGroup() {
    const map = this;
    return new L.MarkerClusterGroup({
      maxClusterRadius(zoom) {
        // choose cluster size dependant of the click region
        const radius = 40 + (1.5 ** (18 - zoom) - 1) * 10;
        return Math.round(Math.max(40, Math.min(radius, 120)));
      },
      iconCreateFunction(cluster) {
        const propertiesArray = cluster
          .getAllChildMarkers()
          .map(marker => marker.feature.properties);
        const options = { propertiesArray };
        if (isEqual(map.props.accessibilityFilter, ['unknown'])) {
          options.backgroundColor = 'rgb(171, 167, 160)';
        }
        return new ClusterIcon(options);
      },
      animate: true,
      chunkedLoading: true,
    });
  }

  createMarkerFromFeature = (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;
    if (
      !isWheelmapFeature(feature) &&
      !properties.accessibility &&
      !includes(EquipmentCategoryStrings, properties.category)
    )
      return null;

    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeature: this.props.hrefForFeature,
      feature,
    });
  };

  componentDidMount() {
    const initialMapState = this.getMapStateFromProps(this.props);
    const map: L.Map = L.map(this.mapElement, {
      maxZoom: this.props.maxZoom,
      center: initialMapState.center,
      zoom: initialMapState.zoom,
      minZoom: 2,
      zoomControl: false,
    });

    if (!map) {
      throw new Error('Could not initialize map component.');
    }

    map.on('click', () => {
      if (this.props.onClick) this.props.onClick();
    });
    this.map = map;
    if (this.props.onMapMounted) {
      this.props.onMapMounted(map);
    }
    // globalFetchManager.registerMap(map);

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    map.on('moveend', () => this.onMoveEnd());
    map.on('zoomend', () => this.onMoveEnd());

    let unitSystem = this.props.unitSystem;
    if (!unitSystem) {
      // derive unitSystem from locale
      unitSystem = useImperialUnits() ? 'imperial' : 'metric';
    }

    this.setupLocateMeButton(map);

    const basemapLayer = L.tileLayer(this.props.mapboxTileUrl, {
      maxZoom: this.props.maxZoom,
      id: 'accessibility-cloud',
    });

    map.addLayer(basemapLayer);

    this.highLightLayer = new L.LayerGroup();
    map.addLayer(this.highLightLayer);

    const markerClusterGroup = this.createMarkerClusterGroup();

    // markerClusterGroup.on('clusterclick', (cluster) => {
    //   const markers = cluster.layer.getAllChildMarkers();
    //   markers.forEach(marker => marker.)
    // });

    this.featureLayer = new L.LayerGroup();
    this.featureLayer.addLayer(markerClusterGroup);

    loadExistingLocalizationByPreference().then(() => {
      const locale = currentLocales[0];
      if (!locale) {
        console.error('Could not load AC tile layer because no current locale is set.');
      }
      const accessibilityCloudTileUrl = this.props.accessibilityCloudTileUrl(locale);
      this.accessibilityCloudTileLayer = new GeoJSONTileLayer(accessibilityCloudTileUrl, {
        featureCache: accessibilityCloudFeatureCache,
        layerGroup: markerClusterGroup,
        featureCollectionFromResponse: accessibilityCloudFeatureCollectionFromResponse,
        pointToLayer: this.createMarkerFromFeature,
        filter: this.isFeatureVisible.bind(this),
        maxZoom: this.props.maxZoom,
      });

      // ensure that the map property is set so that wmp can inject places immediately
      this.accessibilityCloudTileLayer._map = this.map;
      this.updateFeatureLayerVisibility(this.props);
    });

    Categories.fetchOnce(this.props)
      .then(() => {
        this.setupWheelmapTileLayer(markerClusterGroup);
        this.updateFeatureLayerVisibility(this.props);
        map.on('moveend', () => {
          this.updateFeatureLayerVisibility();
        });
        map.on('zoomend', () => {
          this.updateFeatureLayerVisibility();
        });
        map.on('zoomstart', () => {
          this.removeLayersNotVisibleInZoomLevel();
        });
      })
      .catch(error => {
        const onError = this.props.onError;
        if (onError) {
          const wrappedError = new Error(`Could not load categories: ${String(error)}.`);
          onError(wrappedError);
        }
      });

    globalFetchManager.addEventListener('stop', () => this.updateTabIndexes());
  }

  componentWillUnmount() {
    if (!this.map) return;
    this.map.off();
    // globalFetchManager.unregisterMap(this.map);
    delete this.map;
    delete this.highLightLayer;
    delete this.mapElement;
    delete this.featureLayer;
    delete this.wheelmapTileLayer;
    delete this.accessibilityCloudTileLayer;
  }

  setupLocateMeButton(map: L.Map) {
    this.locateControl = addLocateControlToMap(map, {
      locateOnStart: this.props.locateOnStart || false,
      onLocationError: (error: any) => {
        if (
          error &&
          error.type &&
          error.type === 'locationerror' &&
          error.code &&
          error.code === 1
        ) {
          // System does not allow to use location services
          if (!hasOpenedLocationHelp()) {
            // If you open location help once, do not show this hint again until you click the
            // location button
            this.setState({ showLocationNotAllowedHint: true });
          }
        }
      },
      onClick: () => {
        saveState({ hasOpenedLocationHelp: 'false' });
        if (this.state.showLocationNotAllowedHint) {
          goToLocationSettings();
          this.setState({ showLocationNotAllowedHint: false });
        }
      },
    });

    map.once('locationfound', () => {
      if (this.locateControl && this.props.locateOnStart && !this.mapHasBeenMoved) {
        this.locateControl.setView();
      }
    });
  }

  setupWheelmapTileLayer(markerClusterGroup: L.MarkerClusterGroup) {
    const wheelmapTileUrl = this.wheelmapTileUrl();
    if (wheelmapTileUrl) {
      this.wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
        featureCache: wheelmapLightweightFeatureCache,
        layerGroup: markerClusterGroup,
        featureCollectionFromResponse: wheelmapFeatureCollectionFromResponse,
        pointToLayer: this.props.pointToLayer,
        filter: this.isFeatureVisible.bind(this),
        maxZoom: this.props.maxZoom,
        cordova: true,
      });
    }
  }

  removeLayersNotVisibleInZoomLevel() {
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !accessibilityCloudTileLayer) return;

    const minimalZoomLevelForFeatures = this.props.category
      ? this.props.minZoomWithSetCategory
      : this.props.minZoomWithoutSetCategory;

    if (this.props.category) {
      if (featureLayer.hasLayer(this.accessibilityCloudTileLayer)) {
        console.log('Hide AC layer...');
        featureLayer.removeLayer(this.accessibilityCloudTileLayer);
      }
    }
    if (map.getZoom() < minimalZoomLevelForFeatures && map.hasLayer(featureLayer)) {
      console.log('Hide feature layer...');
      map.removeLayer(featureLayer);
    }
  }

  addAttribution() {
    const map = this.map;
    if (!map) return;

    map.attributionControl.setPrefix(null);
    // map.attributionControl.addAttribution(sozialheldenAttribution);
    // map.attributionControl.addAttribution(mapboxOSMAttribution);
  }

  componentWillReceiveProps(newProps: Props) {
    const map = this.map;
    if (!map) return;

    this.navigate(newProps);

    if (!this.props.isLocalizationLoaded && newProps.isLocalizationLoaded) {
      this.addAttribution();
    }

    // Sort is mutable. Create a new array and sort this one instead.
    const accessibilityFilterChanged = !isEqual(
      [...this.props.accessibilityFilter].sort(),
      [...newProps.accessibilityFilter].sort()
    );

    // Sort is mutable. Create a new array and sort this one instead.
    const toiletFilterChanged = !isEqual(
      [...this.props.toiletFilter].sort(),
      [...newProps.toiletFilter].sort()
    );

    if (accessibilityFilterChanged || toiletFilterChanged) {
      setTimeout(() => {
        if (this.accessibilityCloudTileLayer) this.accessibilityCloudTileLayer._reset();
        if (this.wheelmapTileLayer) this.wheelmapTileLayer._reset();
        if (this.accessibilityCloudTileLayer)
          this.accessibilityCloudTileLayer._update(map.getCenter());
        if (this.wheelmapTileLayer) this.wheelmapTileLayer._update(map.getCenter());
      }, 100);
    }
  }

  zoomIn = (event: Event) => {
    if (this.map) {
      this.map.zoomIn();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  navigate(props: Props = this.props) {
    if (!this.map) {
      return;
    }

    this.setState({ accessibilityFilter: props.accessibilityFilter });
    this.setState({ toiletFilter: props.toiletFilter });

    const mapState = this.getMapStateFromProps(props);
    this.updateMapCenter(mapState.center, mapState.zoom, props.padding, this.state);

    Categories.fetchOnce(props)
      .then(() => {
        this.updateFeatureLayerVisibility(props);
      })
      .catch(e => {});
  }

  updateFeatureLayerVisibility = debounce((props: Props = this.props) => {
    // console.log('Update feature layer visibility...');
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const wheelmapTileLayer = this.wheelmapTileLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !accessibilityCloudTileLayer) return;

    let minimalZoomLevelForFeatures = this.props.minZoomWithSetCategory;

    if (map.getZoom() >= minimalZoomLevelForFeatures) {
      if (!map.hasLayer(featureLayer)) {
        // console.log('Show feature layer...');
        map.addLayer(featureLayer);
      }
    } else if (map.hasLayer(featureLayer)) {
      // console.log('Hide feature layer...');
      map.removeLayer(featureLayer);
    }

    this.updateFeatureLayerSourceUrls(props);

    if (!this.props.category) {
      minimalZoomLevelForFeatures = this.props.minZoomWithoutSetCategory;
      if (!featureLayer.hasLayer(accessibilityCloudTileLayer) && accessibilityCloudTileLayer) {
        // console.log('Show AC layer...');
        featureLayer.addLayer(this.accessibilityCloudTileLayer);
        accessibilityCloudTileLayer._update(map.getCenter());
      }
    }

    if (!featureLayer.hasLayer(wheelmapTileLayer) && wheelmapTileLayer) {
      // console.log('Show wheelmap layer...');
      featureLayer.addLayer(wheelmapTileLayer);
      wheelmapTileLayer._update(map.getCenter());
    }

    this.updateHighlightedMarker(props);
  }, 100);

  // calculate bounds with variable pixel padding
  calculateBoundsWithPadding(padding: Padding) {
    const map: L.Map = this.map;
    const mapSize = map.getSize();
    const zoom = map.getZoom();
    const corner1 = map.containerPointToLatLng(new L.Point(padding.left, padding.top), zoom);
    const corner2 = map.containerPointToLatLng(
      new L.Point(mapSize.x - padding.right, mapSize.y - padding.bottom),
      zoom
    );
    const bounds = L.latLngBounds([corner1, corner2]);
    return bounds;
  }

  offsetCoordsWithPadding(coords: L.LatLng, padding: Padding) {
    const map: L.Map = this.map;
    const mapSize = map.getSize();
    const mCenter = mapSize.divideBy(2);
    const vCenter = new L.Point(
      padding.left + (mapSize.x - padding.right - padding.left) / 2,
      padding.top + (mapSize.y - padding.top - padding.bottom) / 2
    );
    const offset = mCenter.subtract(vCenter);
    const zoom = map.getZoom();
    var point = map.project(coords, zoom);
    point = point.add(offset);
    return map.unproject(point, zoom);
  }

  updateMapCenter(coords: [number, number], zoom: number, padding: ?Padding, state: State) {
    const map: L.Map = this.map;
    const center = map.getCenter();

    let moved = false;

    const actualPadding = padding || { top: 10, left: 10, right: 10, bottom: 10 };
    const targetCoords = this.offsetCoordsWithPadding(coords, actualPadding);
    if (targetCoords && !isSamePosition(targetCoords, [center.lat, center.lng])) {
      const bounds = this.calculateBoundsWithPadding(actualPadding);
      const isWithinBounds = bounds.contains(targetCoords);
      if (!isWithinBounds) {
        // animate if old map center is within sight
        const shouldAnimate = map.getBounds().contains(targetCoords);
        moved = true;
        map.flyTo(targetCoords, zoom, {
          animate: shouldAnimate,
          noMoveStart: true,
        });
      }
    }

    if (!moved && zoom !== map.getZoom()) {
      moved = true;
      map.setZoom(zoom, {
        animate: true,
      });
    }
  }

  getMapStateFromProps(props: Props) {
    // use old settings for anything but the initial
    const map = this.map;
    let fallbackZoom = props.maxZoom - 1;
    let fallbackCenter = props.defaultStartCenter;

    if (map) {
      const center = map.getCenter();

      fallbackCenter = [center.lat, center.lng];
      fallbackZoom = map.getZoom();
    }

    let overrideZoom = props.zoom;

    // Prevent the map from being empty when navigating to a new category
    if (props.category && this.props.category !== props.category) {
      overrideZoom = Math.min(
        props.minZoomWithSetCategory || 20,
        props.zoom || props.minZoomWithSetCategory
      );
    }

    const zoom = overrideZoom || fallbackZoom;

    const feature = props.feature;

    let center;

    // Use the feature coordinates
    if (
      feature &&
      getFeatureId(feature) !== this.lastFeatureId &&
      feature.geometry &&
      feature.geometry.type === 'Point' &&
      feature.geometry.coordinates instanceof Array
    ) {
      const coords = feature.geometry.coordinates;
      const featureCoordinates = coords && normalizeCoordinates([coords[1], coords[0]]);

      center = featureCoordinates || fallbackCenter;
    } else if (props.lat && props.lon) {
      center = normalizeCoordinates([props.lat, props.lon]);
    } else {
      center = fallbackCenter;
    }

    // Store feature id to make sure we only zoom to the place once.
    if (feature && feature.properties) {
      this.lastFeatureId = getFeatureId(feature);
    } else {
      this.lastFeatureId = null;
    }

    return { center, zoom };
  }

  updateHighlightedMarker(props: Props) {
    if (props.featureId) {
      if (this.wheelmapTileLayer) {
        this.wheelmapTileLayer.highlightMarkersWithIds(this.highLightLayer, [
          String(props.featureId),
        ]);
      }
      const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;
      if (accessibilityCloudTileLayer) {
        let ids = [String(props.featureId)];
        if (typeof props.equipmentInfoId === 'string') {
          ids = equipmentInfoCache.findSimilarEquipmentIds(props.equipmentInfoId);
        }
        accessibilityCloudTileLayer.highlightMarkersWithIds(this.highLightLayer, ids);
      }
    } else {
      if (this.wheelmapTileLayer) this.wheelmapTileLayer.resetHighlights();
      if (this.accessibilityCloudTileLayer) this.accessibilityCloudTileLayer.resetHighlights();
      highlightMarkers(this.highLightLayer, []);
    }
  }

  isFeatureVisible(feature: Feature) {
    if (!feature) return false;
    if (!feature.properties) return false;
    const properties = feature.properties;
    const { accessibilityFilter, toiletFilter } = this.state;
    const hasMatchingA11y = includes(accessibilityFilter, isWheelchairAccessible(properties));
    const hasMatchingToilet = includes(toiletFilter, hasAccessibleToilet(properties));
    return hasMatchingA11y && hasMatchingToilet;
  }

  updateFeatureLayerSourceUrls = debounce((props: Props = this.props) => {
    const wheelmapTileLayer = this.wheelmapTileLayer;
    if (!wheelmapTileLayer) return;
    const url = this.wheelmapTileUrl(props);
    const featureLayer = this.featureLayer;
    if (featureLayer && wheelmapTileLayer._url !== url) {
      console.log('Setting new URL on wheelmap layer / removing + re-adding layer:', url);
      wheelmapTileLayer._reset();
      featureLayer.removeLayer(wheelmapTileLayer);
      featureLayer.addLayer(wheelmapTileLayer);
      wheelmapTileLayer.setUrl(url);
    }
  }, 500);

  focus() {
    if (this.mapElement) this.mapElement.focus();
  }

  renderZoomInfo() {
    // translator: Shown when zoomed out to far
    const caption = t`Zoom in closer to see more places`;
    return (
      <NotificationButton
        isHidden={this.props.hideHints || !this.state.showZoomInfo}
        onActivate={this.zoomIn}
        caption={caption}
        ariaHidden
        topPosition={10}
        color={colors.notificationBackgroundColor}
      />
    );
  }

  renderGeolocationError() {
    // translator: Shown next to the locate-me button when location services are not enabled
    const caption = t`Turn on location services`;
    const isHidden =
      this.props.hideHints || !this.state.showLocationNotAllowedHint || hasOpenedLocationHelp();

    return (
      <NotificationButton
        isHidden={isHidden}
        onActivate={() => {
          goToLocationSettings();
          this.setState({ showLocationNotAllowedHint: false });
        }}
        caption={caption}
        ariaHidden
        topPosition={120}
        color={colors.notificationBackgroundColor}
      />
    );
  }

  render() {
    const className = [
      userAgent.os.name === 'Android' ? 'is-android-platform' : null,
      this.props.className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <section
        className={className}
        ref={el => (this.mapElement = el)}
        role="main"
        aria-label={t`Map`}
      >
        {this.renderZoomInfo()}
        {this.renderGeolocationError()}
        <a
          href="http://mapbox.com/about/maps"
          className="mapbox-wordmark"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mapbox
        </a>
        <span className="mapbox-attribution-container">
          <span className="sozialhelden-logo-container">
            <a href="https://www.sozialhelden.de">
              <SozialheldenLogo /> |{' '}
            </a>
          </span>
          <a href="https://www.mapbox.com/about/maps/">© Mapbox | </a>
          <a href="http://www.openstreetmap.org/copyright">© OpenStreetMap | </a>
          <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">
            <strong>Improve this map</strong>
          </a>
        </span>
      </section>
    );
  }

  wheelmapTileUrl(props: Props = this.props): ?string {
    // For historical reasons:
    // 'Classic' Wheelmap way of fetching GeoJSON tiles:
    // const wheelmapTileUrl = '/nodes/{x}/{y}/{z}.geojson?limit=25';
    const baseUrl = this.props.wheelmapApiBaseUrl;
    if (typeof baseUrl !== 'string') return null;
    const wheelmapApiKey = this.props.wheelmapApiKey;
    const categoryName = props.category;
    if (!wheelmapApiKey) {
      return null;
    }
    if (categoryName) {
      const category = Categories.wheelmapRootCategoryWithName(categoryName);
      if (!category) {
        return null;
      }
      return `${baseUrl}/api/categories/${
        category.id
      }/nodes/?api_key=${wheelmapApiKey}&per_page=100&bbox={bbox}&limit=100`;
    }
    return `${baseUrl}/api/nodes/?api_key=${wheelmapApiKey}&per_page=25&bbox={bbox}&per_page=100&limit=100`;
  }
}
