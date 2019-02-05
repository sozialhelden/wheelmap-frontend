// @flow

import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster-src';
import { t } from 'ttag';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import * as React from 'react';
import SozialheldenLogo from './SozialheldenLogo';
import { currentLocales } from '../../lib/i18n';
import LeafletLocateControl from './L.Control.Locate';
import HighlightableMarker from './HighlightableMarker';
import { isWheelmapFeature } from '../../lib/Feature';
import { CategoryStrings as EquipmentCategoryStrings } from '../../lib/EquipmentInfo';

import {
  isWheelchairAccessible,
  hasAccessibleToilet,
  wheelmapFeatureCollectionFromResponse,
  accessibilityCloudFeatureCollectionFromResponse,
  getFeatureId,
} from '../../lib/Feature';
import ClusterIcon from './ClusterIcon';
import Categories, {
  type CategoryLookupTables,
  type RootCategoryEntry,
} from '../../lib/Categories';
import isSamePosition from './isSamePosition';
import GeoJSONTileLayer from './GeoJSONTileLayer';
import addLocateControlToMap from './addLocateControlToMap';
import getAccessibilityCloudTileUrl from './getAccessibilityCloudTileUrl';
import goToLocationSettings from '../../lib/goToLocationSettings';
import highlightMarkers from './highlightMarkers';
import overrideLeafletZoomBehavior from './overrideLeafletZoomBehavior';
import type { Feature, NodeProperties, YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';
import type { EquipmentInfo, EquipmentInfoProperties } from '../../lib/EquipmentInfo';
import type { PotentialPromise } from '../../app/PlaceDetailsProps';
import { normalizeCoordinate, normalizeCoordinates } from '../../lib/normalizeCoordinates';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../lib/cache/WheelmapLightweightFeatureCache';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';
import { globalFetchManager } from '../../lib/FetchManager';
import { getUserAgent } from '../../lib/userAgent';
import NotificationButton from './NotificationButton';
import { hasOpenedLocationHelp, saveState } from '../../lib/savedState';
import colors from '../../lib/colors';
import useImperialUnits from '../../lib/useImperialUnits';
import { tileLoadingStatus } from './trackTileLoadingState';
import { type Cluster } from './Cluster';

import './Leaflet.css';
import './Map.css';

window.L = L;

type Padding = {
  top: number,
  left: number,
  right: number,
  bottom: number,
};
type MoveArgs = {
  zoom: number,
  lat: number,
  lon: number,
  bbox: L.LatLngBounds,
};

type TargetMapState = {
  center: [number, number],
  zoom: number,
  bounds: ?L.LatLngBounds,
  zoomedToFeatureId: ?string,
};

type Props = {
  featureId?: ?string,
  feature?: PotentialPromise<?Feature>,
  equipmentInfoId?: ?string,
  equipmentInfo?: ?PotentialPromise<?EquipmentInfo>,

  categories: CategoryLookupTables,
  lat?: ?number,
  lon?: ?number,
  zoom?: ?number,
  extent: ?[number, number, number, number],

  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  disableWheelmapSource: ?boolean,

  onMarkerClick: (featureId: string, properties: ?NodeProperties) => void,
  onClusterClick: (cluster: Cluster) => void,
  onMoveEnd?: (args: MoveArgs) => void,
  onClick?: () => void,
  onError?: (error: ?Error | string) => void,
  categoryId: ?string,
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
  hrefForFeature: (
    featureId: string,
    properties: ?NodeProperties | EquipmentInfoProperties
  ) => string,
  accessibilityCloudAppToken: string,
  accessibilityCloudBaseUrl: string,
  wheelmapApiBaseUrl: string,
  wheelmapApiKey: string,
  mapboxTileUrl: string,
  maxZoom: number,
  minZoomWithSetCategory: number,
  minZoomWithoutSetCategory: number,
  defaultStartCenter: [number, number],
  locateOnStart?: boolean,
  padding: ?Padding,
  className: ?string,
  onMapMounted?: (map: L.Map) => void,
  unitSystem?: 'metric' | 'imperial',
  hideHints?: boolean,
  onLocationError: (error: any) => void,
  forwardedRef: ?(map: ?Map) => void,
};

type State = {
  showZoomInfo?: boolean,
  showLocationNotAllowedHint: boolean,
  placeOrEquipment?: ?(Feature | EquipmentInfo),
  placeOrEquipmentPromise?: ?Promise<?Feature | ?EquipmentInfo>,
  zoomedToFeatureId: ?string,
  category: ?RootCategoryEntry,
};

overrideLeafletZoomBehavior();

export default class Map extends React.Component<Props, State> {
  props: Props;
  state: State = {
    showLocationNotAllowedHint: false,
    placeOrEquipment: null,
    placeOrEquipmentPromise: null,
    zoomedToFeatureId: null,
    category: null,
  };
  map: ?L.Map;
  mapElement: ?HTMLElement;
  featureLayer: ?L.LayerGroup;
  wheelmapTileLayer: ?GeoJSONTileLayer;
  accessibilityCloudTileLayer: ?GeoJSONTileLayer;
  highLightLayer: ?L.Layer;
  locateControl: ?LeafletLocateControl;
  mapHasBeenMoved: boolean = false;

  static getMapStateFromProps(
    map: ?L.Map,
    state: State,
    props: Props,
    lastProps?: Props
  ): TargetMapState {
    // use old settings for anything but the initial
    let fallbackZoom = props.maxZoom - 1;
    let fallbackCenter = props.defaultStartCenter;

    if (map) {
      const center = map.getCenter();

      fallbackCenter = [center.lat, center.lng];
      fallbackZoom = map.getZoom();
    }

    let overrideZoom = props.zoom;

    // Prevent the map from being empty when navigating to a new category
    if (props.categoryId && (!lastProps || lastProps.categoryId !== props.categoryId)) {
      overrideZoom = Math.min(
        props.minZoomWithSetCategory || 20,
        props.zoom || props.minZoomWithSetCategory
      );
    }

    const zoom = overrideZoom || fallbackZoom;

    const placeOrEquipment = state.placeOrEquipment;

    let center = [0, 0];
    let bounds = null;
    let zoomedToFeatureId = state.zoomedToFeatureId;

    // use the feature coordinates, but only if they changed
    if (
      placeOrEquipment &&
      getFeatureId(placeOrEquipment) !== state.zoomedToFeatureId &&
      placeOrEquipment.geometry &&
      placeOrEquipment.geometry.type === 'Point' &&
      placeOrEquipment.geometry.coordinates instanceof Array
    ) {
      const coords = placeOrEquipment.geometry.coordinates;
      const featureCoordinates = coords && normalizeCoordinates([coords[1], coords[0]]);
      center = featureCoordinates || fallbackCenter;

      // Store feature id to make sure we only zoom to the place once.
      zoomedToFeatureId = getFeatureId(placeOrEquipment);
    } else {
      if (props.extent) {
        // only use changed bounds once
        const newBounds = new L.LatLngBounds([
          [props.extent[1], props.extent[0]],
          [props.extent[3], props.extent[2]],
        ]);
        const prevBounds =
          lastProps && lastProps.extent
            ? new L.LatLngBounds([
                [lastProps.extent[1], lastProps.extent[0]],
                [lastProps.extent[3], lastProps.extent[2]],
              ])
            : null;
        const hasChangedExtents = !prevBounds || !newBounds.equals(prevBounds, 0.01);

        if (hasChangedExtents) {
          bounds = newBounds;
        }
      }

      if (props.lat && props.lon) {
        center = normalizeCoordinates([props.lat, props.lon]);
      } else {
        center = fallbackCenter;
      }
    }

    return { center, zoom, bounds, zoomedToFeatureId };
  }

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
    const { feature, equipmentInfo } = props;

    const placeOrEquipment = equipmentInfo || feature;
    const category = Categories.getRootCategory(props.categoryId);

    // works also without a feature
    if (placeOrEquipment) {
      // Do not update anything when the same promise or feature is already in use.
      if (
        placeOrEquipment === state.placeOrEquipmentPromise ||
        placeOrEquipment === state.placeOrEquipment
      ) {
        return { category };
      }

      if (placeOrEquipment instanceof Promise) {
        return { category, placeOrEquipment: null, placeOrEquipmentPromise: placeOrEquipment };
      }

      return { category, placeOrEquipment, placeOrEquipmentPromise: null };
    }

    return {
      category,
      placeOrEquipment: null,
      placeOrEquipmentPromise: null,
      zoomedToFeatureId: null,
    };
  }

  componentDidMount() {
    const initialMapState = Map.getMapStateFromProps(null, this.state, this.props);
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

    if (initialMapState.bounds) {
      map.fitBounds(initialMapState.bounds, {
        animate: false,
        noMoveStart: true,
      });
    }

    map.on('click', () => {
      if (this.props.onClick) this.props.onClick();
    });
    this.map = map;
    if (this.props.onMapMounted) {
      this.props.onMapMounted(map);
    }

    tileLoadingStatus.registerMap(map);

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
    markerClusterGroup.on('clusterclick', cluster => {
      if (this.props.zoom === this.props.maxZoom) {
        const markers = cluster.layer.getAllChildMarkers();
        this.props.onClusterClick({
          features: markers.map(m => m.feature),
        });
      }
    });

    this.featureLayer = new L.LayerGroup();
    this.featureLayer.addLayer(markerClusterGroup);

    this.setupAccessibilityCloudTileLayer(markerClusterGroup);
    this.updateFeatureLayerVisibility();

    this.setupWheelmapTileLayer(markerClusterGroup);
    this.updateFeatureLayerVisibility();

    map.on('moveend', () => {
      this.updateFeatureLayerVisibility();
    });
    map.on('zoomend', () => {
      this.updateFeatureLayerVisibility();
    });
    map.on('zoomstart', () => {
      this.removeLayersNotVisibleInZoomLevel();
    });

    globalFetchManager.addEventListener('stop', () => this.updateTabIndexes());

    this.addAttribution();

    const { placeOrEquipmentPromise } = this.state;
    if (placeOrEquipmentPromise) {
      placeOrEquipmentPromise.then(placeOrEquipment =>
        this.handlePromiseResolved(placeOrEquipmentPromise, placeOrEquipment)
      );
    }

    if (this.props.forwardedRef) this.props.forwardedRef(this);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const map = this.map;
    if (!map) return;

    this.navigate(this.state, this.props, prevProps);

    // Sort is mutable. Create a new array and sort this one instead.
    const accessibilityFilterChanged = !isEqual(
      [...this.props.accessibilityFilter].sort(),
      [...prevProps.accessibilityFilter].sort()
    );

    // Sort is mutable. Create a new array and sort this one instead.
    const toiletFilterChanged = !isEqual(
      [...this.props.toiletFilter].sort(),
      [...prevProps.toiletFilter].sort()
    );

    const customFilterChanged =
      this.props.categoryId !== prevProps.categoryId &&
      ((prevState.category && prevState.category.isMetaCategory) ||
        (this.state.category && this.state.category.isMetaCategory));

    const filterNeedsRefreshing =
      accessibilityFilterChanged || toiletFilterChanged || customFilterChanged;
    if (filterNeedsRefreshing) {
      setTimeout(() => {
        // console.log("Resetting layers", accessibilityFilterChanged, toiletFilterChanged, customFilterChanged);
        if (this.accessibilityCloudTileLayer) this.accessibilityCloudTileLayer._reset();
        if (this.wheelmapTileLayer) this.wheelmapTileLayer._reset();
        if (this.accessibilityCloudTileLayer)
          this.accessibilityCloudTileLayer._update(map.getCenter());
        if (this.wheelmapTileLayer) this.wheelmapTileLayer._update(map.getCenter());
      }, 100);
    }

    const { placeOrEquipmentPromise } = this.state;
    if (placeOrEquipmentPromise && prevState.placeOrEquipmentPromise !== placeOrEquipmentPromise) {
      placeOrEquipmentPromise.then(placeOrEquipment =>
        this.handlePromiseResolved(placeOrEquipmentPromise, placeOrEquipment)
      );
    }

    if (prevProps.categoryId !== this.props.categoryId) {
      this.updateFeatureLayerVisibility();
    }
  }

  componentWillUnmount() {
    if (this.props.forwardedRef) this.props.forwardedRef(null);

    if (!this.map) return;
    this.map.off();
    tileLoadingStatus.unregisterMap(this.map);

    delete this.map;
    delete this.highLightLayer;
    delete this.mapElement;
    delete this.featureLayer;
    delete this.wheelmapTileLayer;
    delete this.accessibilityCloudTileLayer;
  }

  handlePromiseResolved(
    placeOrEquipmentPromise: Promise<?Feature | ?EquipmentInfo>,
    placeOrEquipment: ?(Feature | EquipmentInfo)
  ) {
    if (this.state.placeOrEquipmentPromise !== placeOrEquipmentPromise) {
      return;
    }

    this.setState({
      placeOrEquipment,
    });
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
            // If you open location help once, do not show this hint again until you click
            // the location button
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
    if (!this.props.disableWheelmapSource) {
      // always create wheelmap tile layer, even if the url is empty
      // if we don't do this, and if the app is started with an unknown
      // category selected, a wheelmap layer is never created
      const wheelmapTileUrl = this.wheelmapTileUrl();
      this.wheelmapTileLayer = new GeoJSONTileLayer(wheelmapTileUrl, {
        featureCache: wheelmapLightweightFeatureCache,
        layerGroup: markerClusterGroup,
        featureCollectionFromResponse: wheelmapFeatureCollectionFromResponse,
        pointToLayer: this.createMarkerFromFeature,
        filter: this.isFeatureVisible.bind(this),
        maxZoom: this.props.maxZoom,
        cordova: true,
      });
    }
  }

  setupAccessibilityCloudTileLayer(markerClusterGroup: L.MarkerClusterGroup) {
    const locale = currentLocales[0];
    if (!locale) {
      console.error('Could not load AC tile layer because no current locale is set.');
    }
    const tileUrl = getAccessibilityCloudTileUrl(
      locale,
      this.props.includeSourceIds,
      this.props.excludeSourceIds
    );

    this.accessibilityCloudTileLayer = new GeoJSONTileLayer(tileUrl, {
      featureCache: accessibilityCloudFeatureCache,
      layerGroup: markerClusterGroup,
      featureCollectionFromResponse: accessibilityCloudFeatureCollectionFromResponse,
      pointToLayer: this.createMarkerFromFeature,
      filter: this.isFeatureVisible.bind(this),
      maxZoom: this.props.maxZoom,
    });
  }

  removeLayersNotVisibleInZoomLevel() {
    const map: L.Map = this.map;
    const featureLayer = this.featureLayer;
    const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

    if (!map || !featureLayer || !accessibilityCloudTileLayer) return;

    const minimalZoomLevelForFeatures = this.props.categoryId
      ? this.props.minZoomWithSetCategory
      : this.props.minZoomWithoutSetCategory;

    if (!this.shouldShowAccessibilityCloudLayer(this.props, this.state)) {
      if (featureLayer.hasLayer(this.accessibilityCloudTileLayer)) {
        // console.log('Hide AC layer...');
        featureLayer.removeLayer(this.accessibilityCloudTileLayer);
      }
    }
    if (map.getZoom() < minimalZoomLevelForFeatures && map.hasLayer(featureLayer)) {
      // console.log('Hide feature layer...');
      map.removeLayer(featureLayer);
    }
  }

  addAttribution() {
    const map = this.map;
    if (!map) return;

    map.attributionControl.setPrefix(null);
  }

  zoomIn = (event: Event) => {
    if (this.map) {
      this.map.zoomIn();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  navigate(state: State, props: Props, lastProps: Props) {
    if (!this.map) {
      return;
    }

    const targetMapState = Map.getMapStateFromProps(this.map, state, props, lastProps);
    this.updateMapCenter(targetMapState, props.padding, this.state);
    this.updateFeatureLayerVisibility(props, state);
  }

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

    const minimalZoomLevelForFeatures = this.props.categoryId
      ? this.props.minZoomWithSetCategory
      : this.props.minZoomWithoutSetCategory;
    const showZoomInfo = this.map ? this.map.getZoom() < minimalZoomLevelForFeatures : false;
    this.setState({ showZoomInfo });

    this.updateTabIndexes();
  }

  updateFeatureLayerVisibility = debounce(
    (props: Props = this.props, state: State = this.state) => {
      // console.log('Update feature layer visibility...');
      const map: L.Map = this.map;
      const featureLayer = this.featureLayer;
      const wheelmapTileLayer = this.wheelmapTileLayer;
      const accessibilityCloudTileLayer = this.accessibilityCloudTileLayer;

      if (!map || !featureLayer || !this.accessibilityCloudTileLayer) return;

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

      if (this.shouldShowAccessibilityCloudLayer(props, state)) {
        minimalZoomLevelForFeatures = props.minZoomWithoutSetCategory;
        if (!featureLayer.hasLayer(accessibilityCloudTileLayer) && accessibilityCloudTileLayer) {
          // console.log('Show AC layer...');
          featureLayer.addLayer(this.accessibilityCloudTileLayer);
          accessibilityCloudTileLayer._update(map.getCenter());
        }
      } else {
        if (featureLayer.hasLayer(this.accessibilityCloudTileLayer)) {
          // console.log('Hide AC layer...');
          featureLayer.removeLayer(this.accessibilityCloudTileLayer);
        }
      }

      if (!featureLayer.hasLayer(wheelmapTileLayer) && wheelmapTileLayer) {
        // console.log('Show wheelmap layer...');
        featureLayer.addLayer(wheelmapTileLayer);
        wheelmapTileLayer._update(map.getCenter());
      }

      this.updateHighlightedMarker(props);
    },
    100
  );

  shouldShowAccessibilityCloudLayer(props: Props = this.props, state: State = this.state): boolean {
    // always show if no category was selected
    if (!state.category) {
      return true;
    }

    return !!state.category.isMetaCategory;
  }

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

  updateMapCenter(targetMapState: TargetMapState, padding: ?Padding, state: State) {
    const map: L.Map = this.map;
    const center = map.getCenter();

    let moved = false;
    const { center: targetCoords, zoom, bounds } = targetMapState;

    // make max distance zoom dependant
    const mapBounds = map.getBounds();
    const maximalMoveDistance = Math.abs(mapBounds.getWest() - mapBounds.getEast()) * 0.1;

    const effectivePadding = padding || {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    };

    if (bounds && !mapBounds.equals(bounds, 0.01)) {
      map.fitBounds(bounds, {
        paddingTopLeft: [effectivePadding.left, effectivePadding.top],
        paddingBottomRight: [effectivePadding.right, effectivePadding.bottom],
        animate: true,
        noMoveStart: true,
      });
      moved = true;
    } else if (
      targetCoords &&
      !isSamePosition(targetCoords, [center.lat, center.lng], maximalMoveDistance)
    ) {
      const bounds = this.calculateBoundsWithPadding(effectivePadding);
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
      map.setZoom(zoom, { animate: true });
    }

    // prevent zooming in on
    if (this.state.zoomedToFeatureId !== targetMapState.zoomedToFeatureId) {
      this.setState({
        zoomedToFeatureId: targetMapState.zoomedToFeatureId,
      });
    }
  }

  updateHighlightedMarker(props: Props) {
    if (props.featureId) {
      if (this.wheelmapTileLayer) {
        this.wheelmapTileLayer.highlightMarkersWithIds(this.highLightLayer, [
          String(props.featureId),
        ]);
      }
      const acLayer = this.accessibilityCloudTileLayer;
      if (acLayer) {
        let ids = [String(props.featureId)];
        if (typeof props.equipmentInfoId === 'string') {
          ids = equipmentInfoCache.findSimilarEquipmentIds(props.equipmentInfoId);
        }
        acLayer.highlightMarkersWithIds(this.highLightLayer, ids);
      }
    } else {
      if (this.wheelmapTileLayer) this.wheelmapTileLayer.resetHighlights();
      if (this.accessibilityCloudTileLayer) this.accessibilityCloudTileLayer.resetHighlights();
      highlightMarkers(this.highLightLayer, []);
    }
  }

  updateTabIndexes() {
    const map = this.map;
    if (!map) return;
    map.eachLayer(layer => {
      if (layer.getElement && layer.getLatLng) {
        const isInViewport = map.getBounds().contains(layer.getLatLng());
        const layerElement = layer.getElement();
        if (layerElement) {
          layerElement.setAttribute('tabindex', isInViewport ? 0 : -1);
        }
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
        const options: L.Icon.options = {
          propertiesArray,
          categories: map.props.categories,
        };
        if (isEqual(map.props.accessibilityFilter, ['unknown'])) {
          options.backgroundColor = 'rgb(171, 167, 160)';
        }
        return new ClusterIcon(options);
      },
      spiderfyOnMaxZoom: false,
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
    ) {
      return null;
    }

    return new HighlightableMarker(latlng, {
      onClick: this.props.onMarkerClick,
      hrefForFeature: this.props.hrefForFeature,
      feature,
      categories: this.props.categories,
    });
  };

  isFeatureVisible(feature: Feature) {
    const { accessibilityFilter, toiletFilter } = this.props;
    if (!feature) return false;
    if (!feature.properties) return false;
    const properties = feature.properties;
    const hasMatchingA11y = includes(accessibilityFilter, isWheelchairAccessible(properties));
    const hasMatchingToilet = includes(toiletFilter, hasAccessibleToilet(properties));

    let matchesCustomCategoryFilter = true;
    if (this.state.category && this.state.category.filter) {
      matchesCustomCategoryFilter = this.state.category.filter(feature);
    }
    return hasMatchingA11y && hasMatchingToilet && matchesCustomCategoryFilter;
  }

  updateFeatureLayerSourceUrls = debounce((props: Props = this.props) => {
    const wheelmapTileLayer = this.wheelmapTileLayer;
    if (!wheelmapTileLayer) return;
    const url = this.wheelmapTileUrl(props);
    const featureLayer = this.featureLayer;
    if (featureLayer && wheelmapTileLayer._url !== url) {
      // console.log('Setting new URL on wheelmap layer / removing + re-adding layer:', url);
      wheelmapTileLayer._reset();
      featureLayer.removeLayer(wheelmapTileLayer);
      featureLayer.addLayer(wheelmapTileLayer);
      wheelmapTileLayer.setUrl(url);
    }
  }, 500);

  focus() {
    if (this.mapElement) this.mapElement.focus();
  }

  snapToFeature() {
    const map = this.map;
    if (map) {
      const targetState = Map.getMapStateFromProps(
        map,
        { ...this.state, zoomedToFeatureId: null },
        this.props
      );
      map.flyTo(targetState.center, targetState.zoom, {
        animate: true,
        noMoveStart: true,
      });
    }
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
    // translator: Shown next to the locate-me button when location services are not
    // enabled
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
    const userAgent = getUserAgent();
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
            <a href="https://www.sozialhelden.de" target="_blank" rel="noopener noreferrer">
              <SozialheldenLogo />
              &nbsp;|&nbsp;
            </a>
          </span>
          <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">
            © Mapbox |
          </a>
          &nbsp;
          <a
            href="http://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            © OpenStreetMap |
          </a>
          &nbsp;
          <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">
            <strong>Improve this map</strong>
          </a>
        </span>
      </section>
    );
  }

  wheelmapTileUrl(props: Props = this.props, state: State = this.state): ?string {
    // For historical reasons: 'Classic' Wheelmap way of fetching GeoJSON tiles:
    // const wheelmapTileUrl = '/nodes/{x}/{y}/{z}.geojson?limit=25';
    const baseUrl = props.wheelmapApiBaseUrl;
    if (typeof baseUrl !== 'string') return null;
    const wheelmapApiKey = props.wheelmapApiKey;
    const categoryName = props.categoryId;
    if (!wheelmapApiKey) {
      return null;
    }
    const isMetaCategory = state.category && state.category.isMetaCategory;
    if (categoryName && !isMetaCategory) {
      const rootCategory = Categories.wheelmapRootCategoryWithName(props.categories, categoryName);
      if (!rootCategory) {
        const subCategory = Categories.wheelmapCategoryWithName(props.categories, categoryName);
        if (!subCategory) {
          return null;
        }
        return `${baseUrl}/api/node_types/${
          subCategory.id
        }/nodes/?api_key=${wheelmapApiKey}&per_page=100&bbox={bbox}&limit=100`;
      }
      return `${baseUrl}/api/categories/${
        rootCategory.id
      }/nodes/?api_key=${wheelmapApiKey}&per_page=100&bbox={bbox}&limit=100`;
    }
    return `${baseUrl}/api/nodes/?api_key=${wheelmapApiKey}&per_page=25&bbox={bbox}&per_page=100&limit=100`;
  }
}
