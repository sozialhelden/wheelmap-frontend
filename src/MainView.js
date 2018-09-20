// @flow

import * as React from 'react';
import dynamic from 'next/dynamic';

import styled from 'styled-components';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';
import type { Location, RouterHistory } from 'react-router-dom';

import NotFound from './components/NotFound/NotFound';
import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbarFeatureLoader from './components/NodeToolbar/NodeToolbarFeatureLoader';
import NodeToolbar from './components/NodeToolbar/NodeToolbar';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import CreatePlaceDialog from './components/CreatePlaceDialog/CreatePlaceDialog';
import ReportPhotoToolbar from './components/PhotoUpload/ReportPhotoToolbar';
import PhotoUploadCaptchaToolbar from './components/PhotoUpload/PhotoUploadCaptchaToolbar';
import PhotoUploadInstructionsToolbar from './components/PhotoUpload/PhotoUploadInstructionsToolbar';

import SearchButton from './components/SearchToolbar/SearchButton';
import Onboarding from './components/Onboarding/Onboarding';
import FullscreenBackdrop from './components/FullscreenBackdrop';

import config from './lib/config';
import colors from './lib/colors';
import { isFirstStart } from './lib/savedState';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';

import type { Feature, NodeProperties, YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';

import type { EquipmentInfoProperties } from './lib/EquipmentInfo';

import type { ModalNodeState } from './lib/queryParams';
import { getQueryParams, newLocationWithReplacedQueryParams } from './lib/queryParams';

import { isTouchDevice, type UAResult } from './lib/userAgent';

import { type CategoryLookupTables } from './lib/Categories';
import { type SearchResultCollection } from './lib/searchPlaces';
import type { PhotoModel } from './components/NodeToolbar/Photos/PhotoModel';

type Props = {
  className: string,

  history: RouterHistory,
  location: Location,

  featureId: ?string,
  feature?: ?Feature,
  category: ?string,
  categories: CategoryLookupTables,
  userAgent: UAResult,

  toiletFilter: YesNoUnknown[],
  accessibilityFilter: YesNoLimitedUnknown[],
  searchQuery: ?string,
  equipmentInfoId: ?string,
  lat: ?string,
  lon: ?string,
  zoom: ?string,

  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean,
  isNotFoundVisible: boolean,
  lastError: ?string,
  modalNodeState: ModalNodeState,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
  isSearchToolbarExpanded: boolean,
  isSearchButtonVisible: boolean,
  isNodeToolbarDisplayed: boolean,
  shouldLocateOnStart: boolean,
  searchResults: ?SearchResultCollection | ?Promise<SearchResultCollection>,

  onSelectCoordinate: () => void,
  onResetCategory: () => void,
  onClickSearchToolbar: () => void,
  onCloseSearchToolbar: () => void,
  onClickSearchButton: () => void,
  onCloseNotFoundDialog: () => void,
  onToggleMainMenu: () => void,
  onClickFullscreenBackdrop: () => void,
  onMoveEnd: () => void,
  onMapClick: () => void,
  onMarkerClick: (featureId: string, properties: ?NodeProperties) => void,
  onError: () => void,
  onCloseNodeToolbar: () => void,
  onOpenReportMode: () => void,
  onCloseOnboarding: () => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  onCloseCreatePlaceDialog: () => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
  onAddMissingPlaceClick: () => void,
  onSearchQueryChange: (searchQuery: string) => void,

  // simple 3-button status editor feature
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,
  presetStatus: YesNoLimitedUnknown,

  // photo feature
  isPhotoUploadCaptchaToolbarVisible: boolean,
  isPhotoUploadInstructionsToolbarVisible: boolean,
  onStartPhotoUploadFlow: () => void,
  onAbortPhotoUploadFlow: () => void,
  onContinuePhotoUploadFlow: (photos: FileList) => void,
  onFinishPhotoUploadFlow: (photos: FileList, captchaSolution: string) => void,
  onStartReportPhotoFlow: (photo: PhotoModel) => void,
  onAbortReportPhotoFlow: (photo: PhotoModel) => void,
  onFinishReportPhotoFlow: (photo: PhotoModel, reason: string) => void,
  photosMarkedForUpload: FileList | null,
  waitingForPhotoUpload?: boolean,
  photoCaptchaFailed?: boolean,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  photoMarkedForReport: PhotoModel | null,
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

const DynamicMap = dynamic(import('./components/Map/Map'), {
  ssr: false,
});

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

  resizeListener = () => {
    updateTouchCapability();
    this.updateViewportSizeState();
  };

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeListener);
    }
    this.resizeListener();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // this.manageFocus(prevProps, prevState);
  }

  componentWillUnmount() {
    delete this.resizeListener;
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
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

  renderNodeToolbar(
    { featureId, equipmentInfoId, modalNodeState, presetStatus }: $Shape<Props>,
    isNodeRoute: boolean
  ) {
    return (
      <div className="node-toolbar">
        <NodeToolbarFeatureLoader
          {...{ featureId, equipmentInfoId, modalNodeState, presetStatus }}
          ref={nodeToolbar => (this.nodeToolbar = nodeToolbar)}
          history={this.props.history}
          feature={this.props.feature}
          categories={this.props.categories}
          userAgent={this.props.userAgent}
          onOpenWheelchairAccessibility={this.props.onOpenWheelchairAccessibility}
          onOpenToiletAccessibility={this.props.onOpenToiletAccessibility}
          onSelectWheelchairAccessibility={this.props.onSelectWheelchairAccessibility}
          onCloseWheelchairAccessibility={this.props.onCloseWheelchairAccessibility}
          onCloseToiletAccessibility={this.props.onCloseToiletAccessibility}
          hidden={!isNodeRoute}
          photoFlowNotification={this.props.photoFlowNotification}
          photoFlowErrorMessage={this.props.photoFlowErrorMessage}
          onOpenReportMode={this.props.onOpenReportMode}
          onStartPhotoUploadFlow={this.props.onStartPhotoUploadFlow}
          onClickCurrentMarkerIcon={this.props.onClickCurrentMarkerIcon}
          onClose={this.props.onCloseNodeToolbar}
          onReportPhoto={this.props.onStartReportPhotoFlow}
        />
      </div>
    );
  }

  renderSearchToolbar({ category, searchQuery, searchResults }: $Shape<Props>, isInert: boolean) {
    return (
      <SearchToolbar
        ref={searchToolbar => (this.searchToolbar = searchToolbar)}
        history={this.props.history}
        hidden={!this.props.isSearchBarVisible}
        inert={isInert}
        category={category}
        searchQuery={searchQuery}
        searchResults={searchResults}
        accessibilityFilter={this.props.accessibilityFilter}
        toiletFilter={this.props.toiletFilter}
        onChangeSearchQuery={this.props.onSearchQueryChange}
        onFilterChanged={filter => {
          this.props.history.replace(
            newLocationWithReplacedQueryParams(this.props.history, filter)
          );
        }}
        onSelectCoordinate={this.props.onSelectCoordinate}
        onResetCategory={this.props.onResetCategory}
        onClick={this.props.onClickSearchToolbar}
        onClose={this.props.onCloseSearchToolbar}
        isExpanded={this.props.isSearchToolbarExpanded}
        hasGoButton={this.state.isOnSmallViewport}
      />
    );
  }

  renderSearchButton() {
    return (
      <SearchButton
        onClick={event => {
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
      />
    );
  }

  renderOnboarding() {
    return (
      <Onboarding
        isVisible={this.props.isOnboardingVisible}
        onClose={this.props.onCloseOnboarding}
      />
    );
  }

  renderNotFound() {
    return (
      <NotFound
        isVisible={this.props.isNotFoundVisible}
        onClose={this.props.onCloseNotFoundDialog}
        error={this.props.lastError}
      />
    );
  }

  renderMainMenu({ isLocalizationLoaded, lat, lon, zoom }: $Shape<Props>) {
    return (
      <MainMenu
        className="main-menu"
        isOpen={this.props.isMainMenuOpen}
        onToggle={this.props.onToggleMainMenu}
        isLocalizationLoaded={isLocalizationLoaded}
        onAddMissingPlaceClick={this.props.onAddMissingPlaceClick}
        history={this.props.history}
        {...{ lat, lon, zoom }}
      />
    );
  }

  getMapPadding() {
    const hasPanel = !!this.props.feature;
    let isPortrait = false;
    if (typeof window !== 'undefined') {
      isPortrait = window.innerWidth < window.innerHeight;
    }
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
      this.props.modalNodeState ||
      this.props.isPhotoUploadCaptchaToolbarVisible ||
      this.props.isPhotoUploadInstructionsToolbarVisible;

    return (
      <FullscreenBackdrop onClick={this.props.onClickFullscreenBackdrop} isActive={isActive} />
    );
  }

  renderPhotoUploadCaptchaToolbar() {
    return (
      <PhotoUploadCaptchaToolbar
        ref={photoUploadCaptchaToolbar =>
          (this.photoUploadCaptchaToolbar = photoUploadCaptchaToolbar)
        }
        history={this.props.history}
        hidden={!this.props.isPhotoUploadCaptchaToolbarVisible}
        onClose={this.props.onAbortPhotoUploadFlow}
        onCompleted={this.props.onFinishPhotoUploadFlow}
        photosMarkedForUpload={this.props.photosMarkedForUpload}
        waitingForPhotoUpload={this.props.waitingForPhotoUpload}
        photoCaptchaFailed={this.props.photoCaptchaFailed}
        photoFlowErrorMessage={this.props.photoFlowErrorMessage}
      />
    );
  }

  renderPhotoUploadInstructionsToolbar() {
    return (
      <PhotoUploadInstructionsToolbar
        ref={photoUploadInstructionsToolbar =>
          (this.photoUploadInstructionsToolbar = photoUploadInstructionsToolbar)
        }
        history={this.props.history}
        hidden={!this.props.isPhotoUploadInstructionsToolbarVisible}
        waitingForPhotoUpload={this.props.waitingForPhotoUpload}
        onClose={this.props.onAbortPhotoUploadFlow}
        onCompleted={this.props.onContinuePhotoUploadFlow}
      />
    );
  }

  renderReportPhotoToolbar() {
    return (
      <ReportPhotoToolbar
        hidden={!this.props.photoMarkedForReport}
        photo={this.props.photoMarkedForReport}
        onClose={this.props.onAbortReportPhotoFlow}
        onCompleted={this.props.onFinishReportPhotoFlow}
      />
    );
  }

  renderCreateDialog() {
    return (
      <CreatePlaceDialog
        hidden={this.props.modalNodeState !== 'create'}
        onClose={this.props.onCloseCreatePlaceDialog}
        lat={this.props.lat}
        lon={this.props.lon}
      />
    );
  }

  render() {
    const { featureId, searchQuery, equipmentInfoId, presetStatus, searchResults } = this.props;
    const category = this.props.category;
    const isNodeRoute = Boolean(featureId);
    const { lat, lon, zoom, modalNodeState } = this.props;
    const isNodeToolbarVisible = this.props.isNodeToolbarDisplayed;

    const classList = uniq([
      this.props.className,
      this.props.isOnboardingVisible ? 'is-dialog-visible' : null,
      this.props.isNotFoundVisible ? 'is-dialog-visible' : null,
      this.props.isMainMenuOpen ? 'is-main-menu-open' : null,
      this.props.isSearchBarVisible ? 'is-search-bar-visible' : null,
      isNodeToolbarVisible ? 'is-node-toolbar-visible' : null,
      modalNodeState ? 'is-dialog-visible' : null,
      modalNodeState ? 'is-modal' : null,
      this.props.isReportMode ? 'is-report-mode' : null,
    ]).filter(Boolean);

    const searchToolbarIsHidden =
      (isNodeRoute && this.state.isOnSmallViewport) ||
      this.props.isPhotoUploadCaptchaToolbarVisible ||
      this.props.isPhotoUploadInstructionsToolbarVisible ||
      this.props.isOnboardingVisible ||
      this.props.isNotFoundVisible ||
      !!this.props.photoMarkedForReport;

    const isMainMenuInBackground =
      this.props.isOnboardingVisible || this.props.isNotFoundVisible || this.props.modalNodeState;

    const searchToolbarIsInert: boolean = searchToolbarIsHidden || this.props.isMainMenuOpen;

    const map = (
      <DynamicMap
        ref={map => {
          this.map = map;
          if (typeof window !== 'undefined') {
            window.map = map;
          }
        }}
        history={this.props.history}
        onMoveEnd={this.props.onMoveEnd}
        onClick={this.props.onMapClick}
        onMarkerClick={this.props.onMarkerClick}
        hrefForFeature={hrefForFeature}
        onError={this.props.onError}
        lat={lat ? parseFloat(lat) : null}
        lon={lon ? parseFloat(lon) : null}
        zoom={zoom ? parseFloat(zoom) : null}
        category={category}
        featureId={featureId}
        equipmentInfoId={equipmentInfoId}
        feature={this.props.feature}
        categories={this.props.categories}
        accessibilityFilter={this.props.accessibilityFilter}
        toiletFilter={this.props.toiletFilter}
        locateOnStart={this.props.shouldLocateOnStart}
        padding={this.getMapPadding()}
        hideHints={
          this.state.isOnSmallViewport && (isNodeToolbarVisible || this.props.isMainMenuOpen)
        }
        {...config}
      />
    );

    const mainMenu = this.renderMainMenu({ modalNodeState, lat, lon, zoom });
    const nodeToolbar = this.renderNodeToolbar(
      { featureId, equipmentInfoId, modalNodeState, presetStatus },
      isNodeRoute
    );

    return (
      <div className={classList.join(' ')}>
        {!isMainMenuInBackground && mainMenu}
        <div className="behind-backdrop">
          {isMainMenuInBackground && mainMenu}
          {this.renderSearchToolbar({ category, searchQuery, searchResults }, searchToolbarIsInert)}
          {isNodeToolbarVisible && !modalNodeState && nodeToolbar}
          {this.props.isSearchButtonVisible && this.renderSearchButton()}
          {map}
        </div>
        {this.renderFullscreenBackdrop()}
        {isNodeToolbarVisible && modalNodeState && nodeToolbar}
        {this.props.isPhotoUploadCaptchaToolbarVisible && this.renderPhotoUploadCaptchaToolbar()}
        {this.props.isPhotoUploadInstructionsToolbarVisible &&
          this.renderPhotoUploadInstructionsToolbar()}
        {this.props.photoMarkedForReport && this.renderReportPhotoToolbar()}
        {this.renderCreateDialog()}
        {this.renderOnboarding()}
        {this.renderNotFound()}
      </div>
    );
  }
}

const StyledMainView = styled(MainView)`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

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

  &.is-dialog-visible,
  &.is-modal,
  &.is-main-menu-open {
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
      &,
      * {
        pointer-events: none;
      }
    }
  }

  &.is-modal {
    .node-toolbar,
    .toolbar {
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
