// @flow

import * as React from 'react';
import styled from 'styled-components';
import includes from 'lodash/includes';
import queryString from 'query-string';
import type { RouterHistory, Location } from 'react-router-dom';
import { Dots } from 'react-activity';

import Map from './components/Map/Map';
import NotFound from './components/NotFound/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import PhotoUploadCaptchaToolbar from './components/PhotoUpload/PhotoUploadCaptchaToolbar';
import PhotoUploadInstructionsToolbar from './components/PhotoUpload/PhotoUploadInstructionsToolbar';

import SearchButton from './components/SearchToolbar/SearchButton';
import HighlightableMarker from './components/Map/HighlightableMarker';
import Onboarding, { isOnboardingVisible } from './components/Onboarding/Onboarding';
import FullscreenBackdrop from './components/FullscreenBackdrop';


import config from './lib/config';
import colors from './lib/colors';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';

import type {
  Feature,
    YesNoLimitedUnknown,
    YesNoUnknown,
    NodeProperties,
} from './lib/Feature';

import type {
  EquipmentInfoProperties,
} from './lib/EquipmentInfo';

import {
  isWheelmapFeature,
} from './lib/Feature';

import { CategoryStrings as EquipmentCategoryStrings } from './lib/EquipmentInfo';

import { getQueryParams, newLocationWithReplacedQueryParams } from './lib/queryParams';
import isTouchDevice from './lib/isTouchDevice';


type Props = {
  className: string,

  history: RouterHistory,
  location: Location,

  featureId: ?string,
  feature?: ?Feature,
  category: ?string,
  toiletFilter: YesNoUnknown[],
  accessibilityFilter: YesNoLimitedUnknown[],
  searchQuery: ?string,
  equipmentInfoId: ?string,
  lat: ?string,
  lon: ?string,
  zoom: ?string,

  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean;
  isNotFoundVisible: boolean;
  lastError: ?string,
  isEditMode: boolean,
  isReportMode: boolean,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
  isSearchToolbarExpanded: boolean,
  isSearchButtonVisible: boolean,
  isPhotoUploadCaptchaToolbarVisible: boolean,
  isPhotoUploadInstructionsToolbarVisible: boolean,
  shouldLocateOnStart: boolean,

  onSelectCoordinate: (() => void),
  onResetCategory: (() => void),
  onClickSearchToolbar: (() => void),
  onCloseSearchToolbar: (() => void),
  onClickSearchButton: (() => void),
  onCloseNotFoundDialog: (() => void),
  onToggleMainMenu: (() => void),
  onClickFullscreenBackdrop: (() => void),
  onMoveEnd: (() => void),
  onMapClick: (() => void),
  onError: (() => void),
  onCloseNodeToolbar: (() => void),
  onOpenReportMode: (() => void),
  onCloseOnboarding: (() => void),
};


type State = {
  isOnSmallViewport: boolean,
};


function updateTouchCapability() {
  const body = document.body;
  if (!body) return;

  if (isTouchDevice()) {
    body.classList.add('is-touch-device');
  } else {
    body.classList.remove('is-touch-device');
  }
}


function hrefForFeature(featureId: string, properties: ?NodeProperties | EquipmentInfoProperties) {
  if (properties && typeof properties.placeInfoId === 'string') {
    const placeInfoId = properties.placeInfoId;
    if (includes(['elevator', 'escalator'], properties.category)) {
      return `/beta/nodes/${placeInfoId}/equipment/${featureId}`;
    }
  }
  return `/beta/nodes/${featureId}`;
}


class MainView extends React.Component<Props, State> {
  props: Props;

  state: State = {
    isOnSmallViewport: isOnSmallViewport(),
  };

  map: ?any;

  lastFocusedElement: ?HTMLElement;
  nodeToolbar: ?NodeToolbar;
  searchToolbar: ?SearchToolbar;
  photoUploadCaptchaToolbar: ?PhotoUploadCaptchaToolbar;
  photoUploadInstructionsToolbar: ?PhotoUploadInstructionsToolbar;

  onMarkerClick = (featureId: string, properties: ?NodeProperties) => {
    const params = getQueryParams();
    const pathname = hrefForFeature(featureId, properties);
    // const newHref = this.props.history.createHref(location);
    const location = { pathname, search: queryString.stringify(params) };
    this.props.history.push(location);
  };

  createMarkerFromFeature = (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;
    if (!isWheelmapFeature(feature) && !properties.accessibility && !includes(EquipmentCategoryStrings, properties.category)) return null;

    return new HighlightableMarker(latlng, {
      onClick: this.onMarkerClick,
      hrefForFeature,
      feature,
    });
  }


  resizeListener = () => {
    updateTouchCapability();
    this.updateViewportSizeState();
  };


  constructor(props: Props) {
    super(props);

    if (isOnboardingVisible()) {
      this.props.history.replace(props.history.location.pathname, { isOnboardingVisible: true });
    }
  }


  componentDidMount() {
    window.addEventListener('resize', this.resizeListener);
    this.resizeListener();
  }


  componentDidUpdate(prevProps: Props, prevState: State) {
    // this.manageFocus(prevProps, prevState);
  }


  componentWillUnmount() {
    delete this.resizeListener;
    window.removeEventListener('resize', this.resizeListener);
  }


  updateViewportSizeState() {
    this.setState({ isOnSmallViewport: isOnSmallViewport() });
  }

  focusSearchToolbar() {
    if (this.searchToolbar) {
      this.searchToolbar.focus();
    }
  }

  focusNodeToolbar() {
    if (this.nodeToolbar) {
      this.nodeToolbar.focus();
    }
  }

  focusMap() {
    if (this.map) {
      this.map.focus();
    }
  }

  renderNodeToolbar({ featureId, equipmentInfoId, isEditMode, isReportMode }: $Shape<Props>, isNodeRoute: boolean) {
    return <div className="node-toolbar">
      <NodeToolbar
        ref={nodeToolbar => this.nodeToolbar = nodeToolbar}
        history={this.props.history}
        feature={this.props.feature}
        hidden={!isNodeRoute}
        featureId={featureId}
        equipmentInfoId={equipmentInfoId}
        isEditMode={isEditMode}
        isReportMode={isReportMode}
        onClose={this.props.onCloseNodeToolbar}
        onOpenReportMode={this.props.onOpenReportMode}
      />
    </div>;
  }


  renderSearchToolbar({ category, searchQuery, lat, lon }: $Shape<Props>, isInert: boolean) {
    return <SearchToolbar
      ref={searchToolbar => this.searchToolbar = searchToolbar}
      history={this.props.history}
      hidden={!this.props.isSearchBarVisible}
      inert={isInert}
      category={category}
      searchQuery={searchQuery}
      accessibilityFilter={this.props.accessibilityFilter}
      toiletFilter={this.props.toiletFilter}
      onChangeSearchQuery={(newSearchQuery) => {
        if (!newSearchQuery || newSearchQuery.length === 0) {
          this.props.history.replace('/beta/', null);
          return;
        }
        this.props.history.replace(`/beta/search/?q=${newSearchQuery}`, null);
      }}
      onFilterChanged={(filter) => {
        this.props.history.replace(newLocationWithReplacedQueryParams(this.props.history, filter));
      }}
      lat={lat ? parseFloat(lat) : null}
      lon={lon ? parseFloat(lon) : null}
      onSelectCoordinate={this.props.onSelectCoordinate}
      onResetCategory={this.props.onResetCategory}
      onClick={this.props.onClickSearchToolbar}
      onClose={this.props.onCloseSearchToolbar}
      isExpanded={this.props.isSearchToolbarExpanded}
      hasGoButton={this.state.isOnSmallViewport}
    />;
  }


  renderSearchButton() {
    return <SearchButton
      onClick={(event) => {
        event.stopPropagation();
        // Using setTimeout to prevent touch-up events from hovering components
        // in the search toolbar
        setTimeout(() => this.props.onClickSearchButton(), 10);
      }}
      category={this.props.category}
      toiletFilter={this.props.toiletFilter}
      accessibilityFilter={this.props.accessibilityFilter}
      top={60}
      left={10}
    />;
  }


  renderOnboarding({ isLocalizationLoaded }: { isLocalizationLoaded: boolean }) {
    if (!isLocalizationLoaded && this.props.isOnboardingVisible) {
      return <Dots size={36} color={colors.colorizedBackgroundColor} />;
    }

    return <Onboarding
      isVisible={isLocalizationLoaded && this.props.isOnboardingVisible}
      onClose={this.props.onCloseOnboarding}
    />;
  }


  renderNotFound() {
    return <NotFound
      isVisible={this.props.isNotFoundVisible}
      onClose={this.props.onCloseNotFoundDialog}
      error={this.props.lastError}
    />;
  }


  renderMainMenu({ isEditMode, isLocalizationLoaded, lat, lon, zoom }: $Shape<Props>) {
    return <MainMenu
      className="main-menu"
      isOpen={this.props.isMainMenuOpen}
      onToggle={this.props.onToggleMainMenu}
      isEditMode={isEditMode}
      isLocalizationLoaded={isLocalizationLoaded}
      history={this.props.history}
      {...{ lat, lon, zoom }}
    />;
  }


  getMapPadding() {
    const hasPanel = !!this.props.feature;
    const isPortrait = window.innerWidth < window.innerHeight;
    if (hasBigViewport()) {
      return { left: hasPanel ? 400 : 32, right: 32, top: 82, bottom: 64 };
    }

    if (isPortrait) {
      return { left: 32, right: 32, top: 82, bottom: hasPanel ? 256 : 64 };
    }
    return { left: hasPanel ? 400 : 32, right: 32, top: 82, bottom: 64 };
  }


  renderFullscreenBackdrop() {
    const isActive =
      this.props.isMainMenuOpen ||
      this.props.isOnboardingVisible ||
      this.props.isNotFoundVisible ||
      this.props.isEditMode ||
      this.props.isReportMode;

    return <FullscreenBackdrop
      onClick={this.props.onClickFullscreenBackdrop}
      isActive={isActive}
    />;
  }

  renderPhotoUploadCaptchaToolbar() {
    return <PhotoUploadCaptchaToolbar
      ref={photoUploadCaptchaToolbar => this.photoUploadCaptchaToolbar = photoUploadCaptchaToolbar}
      history={this.props.history}
      hidden={!this.props.isPhotoUploadCaptchaToolbarVisible}
      onClose={() => { console.log("captcha.onClosed") }}
      onCompleted={() => { console.log("captcha.onCompleted") }}
    />
  }

  renderPhotoUploadInstructionsToolbar() {
    return <PhotoUploadInstructionsToolbar
      ref={photoUploadInstructionsToolbar => this.photoUploadInstructionsToolbar = photoUploadInstructionsToolbar}
      history={this.props.history}
      hidden={!this.props.isPhotoUploadInstructionsToolbarVisible}
      onClose={() => { console.log("instructions.onClosed") }}
      onCompleted={() => { console.log("instructions.onCompleted") }}
    />
  }

  render() {
    const { featureId, searchQuery, equipmentInfoId } = this.props;
    const { isLocalizationLoaded } = this.props;
    const category = this.props.category;
    const isNodeRoute = Boolean(featureId);
    const isEditMode = this.props.isEditMode;
    const { lat, lon, zoom, isReportMode } = this.props;
    const isNodeToolbarVisible = this.props.feature && !this.props.isSearchToolbarExpanded;

    const classList = [
      'app-container',
      this.props.className,
      this.props.isOnboardingVisible ? 'is-dialog-visible' : null,
      this.props.isNotFoundVisible ? 'is-dialog-visible' : null,
      this.props.isMainMenuOpen ? 'is-main-menu-open' : null,
      this.props.isSearchBarVisible ? 'is-search-bar-visible' : null,
      isNodeToolbarVisible ? 'is-node-toolbar-visible' : null,
      isEditMode ? 'is-edit-mode' : null,
      this.props.isReportMode ? 'is-report-mode' : null,
    ].filter(Boolean);

    const searchToolbarIsHidden =
      (isNodeRoute && this.state.isOnSmallViewport) ||
      this.props.isOnboardingVisible ||
      this.props.isNotFoundVisible;

    const isMainMenuInBackground =
      this.props.isOnboardingVisible ||
      this.props.isNotFoundVisible ||
      isEditMode ||
      this.props.isReportMode;

    const searchToolbarIsInert: boolean = searchToolbarIsHidden || this.props.isMainMenuOpen;
    const isNodeToolbarModal = isReportMode || isEditMode;

    const map = <Map
      ref={(map) => { this.map = map; window.map = map; }}
      history={this.props.history}
      onMoveEnd={this.props.onMoveEnd}
      onClick={this.props.onMapClick}
      onError={this.props.onError}
      lat={lat ? parseFloat(lat) : null}
      lon={lon ? parseFloat(lon) : null}
      zoom={zoom ? parseFloat(zoom) : null}
      category={category}
      featureId={featureId}
      equipmentInfoId={equipmentInfoId}
      feature={this.props.feature}
      accessibilityFilter={this.props.accessibilityFilter}
      toiletFilter={this.props.toiletFilter}
      pointToLayer={this.createMarkerFromFeature}
      locateOnStart={this.props.shouldLocateOnStart}
      isLocalizationLoaded={isLocalizationLoaded}
      padding={this.getMapPadding()}
      hideHints={this.state.isOnSmallViewport && (isNodeToolbarVisible || this.props.isMainMenuOpen)}
      {...config}
    />;

    const mainMenu = this.renderMainMenu({ isEditMode, isLocalizationLoaded, lat, lon, zoom });
    const nodeToolbar = this.renderNodeToolbar({ featureId, equipmentInfoId, isEditMode, isReportMode }, isNodeRoute);

    return (<div className={classList.join(' ')}>
      {!isMainMenuInBackground && mainMenu}
      <div className="behind-backdrop">
        {isMainMenuInBackground && mainMenu}
        {isLocalizationLoaded && this.renderSearchToolbar({ category, searchQuery, lat, lon }, searchToolbarIsInert)}
        {isNodeToolbarVisible && !isNodeToolbarModal && nodeToolbar}
        {isLocalizationLoaded && this.props.isSearchButtonVisible && this.renderSearchButton()}
        {map}
      </div>
      {this.renderFullscreenBackdrop()}
      {isNodeToolbarVisible && isNodeToolbarModal && nodeToolbar}
      {this.props.isPhotoUploadCaptchaToolbarVisible && this.renderPhotoUploadCaptchaToolbar()}
      {this.props.isPhotoUploadInstructionsToolbarVisible && this.renderPhotoUploadInstructionsToolbar()}
      {this.renderOnboarding({ isLocalizationLoaded })}
      {this.renderNotFound()}
    </div>);
  }
}


const StyledMainView = styled(MainView)`
  a {
    color: ${colors.linkColor};
    text-decoration: none;
  }

  > * {
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }

  > .rai-activity-indicator {
    display: inline-block;
    font-size: 36px;
    line-height: 0;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  > .behind-backdrop {
    .toolbar {
      z-index: 1001;
    }
  }

  &.is-dialog-visible, &.is-edit-mode, &.is-report-mode, &.is-main-menu-open {
    > .behind-backdrop {
      .toolbar {
        z-index: 999;
      }
      filter: blur(5px);
      transform: scale3d(0.99, 0.99, 1);
      @media (max-width: 512px), (max-height: 512px) {
        transform: scale3d(0.9, 0.9, 1);
      }
      @media (prefers-reduced-motion: reduce) {
        transform: scale3d(1, 1, 1);
      }
      &, * {
        pointer-events: none;
      }
    }
  }

  &.is-edit-mode, &.is-report-mode {
    .node-toolbar, .toolbar {
      z-index: 1001;
    }
  }

  &.is-main-menu-open {
    > .main-menu {
      z-index: 1001;
    }
  }
`;

export default StyledMainView;
export { MainView as UnstyledMainView };