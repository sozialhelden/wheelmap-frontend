// @flow

import * as React from 'react';
import dynamic from 'next/dynamic';

import styled from 'styled-components';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';
import queryString from 'query-string';
import FocusTrap from '@sozialhelden/focus-trap-react';

import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbarFeatureLoader from './components/NodeToolbar/NodeToolbarFeatureLoader';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import { type PlaceFilter } from './components/SearchToolbar/AccessibilityFilterModel';
import CreatePlaceDialog from './components/CreatePlaceDialog/CreatePlaceDialog';
import ReportPhotoToolbar from './components/PhotoUpload/ReportPhotoToolbar';
import PhotoUploadCaptchaToolbar from './components/PhotoUpload/PhotoUploadCaptchaToolbar';
import PhotoUploadInstructionsToolbar from './components/PhotoUpload/PhotoUploadInstructionsToolbar';
import MapLoading from './components/Map/MapLoading';
import ErrorBoundary from './components/ErrorBoundary';
import WheelmapHomeLink from './components/WheelmapHomeLink';
import type { SearchResultFeature } from './lib/searchPlaces';
import type { WheelmapFeature } from './lib/Feature';
import type { EquipmentInfo } from './lib/EquipmentInfo';
import { translatedStringFromObject } from './lib/i18n';

import SearchButton from './components/SearchToolbar/SearchButton';
import Onboarding from './components/Onboarding/Onboarding';
import FullscreenBackdrop from './components/FullscreenBackdrop';

import config from './lib/config';
import colors from './lib/colors';
import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';

import type { NodeProperties, YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';

import type { EquipmentInfoProperties } from './lib/EquipmentInfo';

import type { ModalNodeState } from './lib/ModalNodeState';

import { isTouchDevice, type UAResult } from './lib/userAgent';

import { type CategoryLookupTables } from './lib/Categories';
import { type SearchResultCollection } from './lib/searchPlaces';
import { type PlaceDetailsProps } from './app/PlaceDetailsProps';

import type { PhotoModel } from './lib/PhotoModel';

import { hasAllowedAnalytics } from './lib/savedState';
import { ClientSideConfiguration } from './lib/ClientSideConfiguration';
import { enableAnalytics, disableAnalytics } from './lib/Analytics';

type Props = {
  className: string,

  category: ?string,
  categories: CategoryLookupTables,
  userAgent: UAResult,

  toiletFilter: YesNoUnknown[],
  accessibilityFilter: YesNoLimitedUnknown[],
  searchQuery: ?string,
  lat: ?number,
  lon: ?number,
  zoom: ?number,
  extent: ?[number, number, number, number],
  inEmbedMode: boolean,

  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  disableWheelmapSource: ?boolean,

  isReportMode: ?boolean,
  isOnboardingVisible: boolean,
  isMainMenuOpen: boolean,
  isNotFoundVisible: boolean,
  modalNodeState: ModalNodeState,
  isLocalizationLoaded: boolean,
  isSearchBarVisible: boolean,
  isSearchToolbarExpanded: boolean,
  isSearchButtonVisible: boolean,
  isNodeToolbarDisplayed: boolean,
  shouldLocateOnStart: boolean,
  searchResults: ?SearchResultCollection | ?Promise<SearchResultCollection>,

  onSearchResultClick: (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => void,
  onSearchToolbarClick: () => void,
  onSearchToolbarClose: () => void,
  onSearchToolbarSubmit: (searchQuery: string) => void,
  onClickSearchButton: () => void,
  onToggleMainMenu: () => void,
  onMainMenuHomeClick: () => void,
  onClickFullscreenBackdrop: () => void,
  onMoveEnd: () => void,
  onMapClick: () => void,
  onMarkerClick: (featureId: string, properties: ?NodeProperties) => void,
  onError: () => void,
  onCloseNodeToolbar: () => void,
  onOpenReportMode: () => void,
  onAbortReportPhotoFlow: () => void,
  onCloseOnboarding: () => void,
  onCloseCreatePlaceDialog: () => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
  onAddMissingPlaceClick: () => void,
  onSearchQueryChange: (searchQuery: string) => void,
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  onShowPlaceDetails: (featureId: string | number) => void,
  // simple 3-button status editor feature
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,
  onAccessibilityFilterButtonClick: (filter: PlaceFilter) => void,
  accessibilityPresetStatus?: YesNoLimitedUnknown,

  // photo feature
  isPhotoUploadCaptchaToolbarVisible: boolean,
  isPhotoUploadInstructionsToolbarVisible: boolean,
  onStartPhotoUploadFlow: () => void,
  onAbortPhotoUploadFlow: () => void,
  onContinuePhotoUploadFlow: (photos: FileList) => void,
  onFinishPhotoUploadFlow: (photos: FileList, captchaSolution: string) => void,
  onStartReportPhotoFlow: (photo: PhotoModel) => void,
  onAbortReportPhotoFlow: () => void,
  onFinishReportPhotoFlow: (photo: PhotoModel, reason: string) => void,
  photosMarkedForUpload: FileList | null,
  waitingForPhotoUpload?: boolean,
  photoCaptchaFailed?: boolean,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  photoMarkedForReport: PhotoModel | null,

  clientSideConfiguration: ClientSideConfiguration,
} & PlaceDetailsProps;

type State = {
  isOnSmallViewport: boolean,
  analyticsAllowed: boolean,
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
      return `/nodes/${placeInfoId}/equipment/${featureId}`;
    }
  }
  return `/nodes/${featureId}`;
}

const DynamicMap = dynamic(import('./components/Map/Map'), {
  ssr: false,
  loading: () => <MapLoading />,
});

class MainView extends React.Component<Props, State> {
  props: Props;

  state: State = {
    isOnSmallViewport: isOnSmallViewport(),
    analyticsAllowed: hasAllowedAnalytics(),
  };

  map: ?{ focus: () => void, snapToFeature: () => void };

  lastFocusedElement: ?HTMLElement;
  nodeToolbar: ?NodeToolbarFeatureLoader;
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

  focusMap() {
    if (this.map) {
      this.map.focus();
    }
  }

  onClickCurrentMarkerIcon = () => {
    if (this.map) {
      this.map.snapToFeature();
    }
  };

  renderNodeToolbar(isNodeRoute: boolean) {
    return (
      <div className="node-toolbar">
        <NodeToolbarFeatureLoader
          featureId={this.props.featureId}
          equipmentInfoId={this.props.equipmentInfoId}
          modalNodeState={this.props.modalNodeState}
          accessibilityPresetStatus={this.props.accessibilityPresetStatus}
          ref={nodeToolbar => (this.nodeToolbar = nodeToolbar)}
          lightweightFeature={this.props.lightweightFeature}
          feature={this.props.feature}
          equipmentInfo={this.props.equipmentInfo}
          categories={this.props.categories}
          sources={this.props.sources}
          photos={this.props.photos}
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
          onClickCurrentMarkerIcon={this.onClickCurrentMarkerIcon}
          onClose={this.props.onCloseNodeToolbar}
          onReportPhoto={this.props.onStartReportPhotoFlow}
          onEquipmentSelected={this.props.onEquipmentSelected}
          onShowPlaceDetails={this.props.onShowPlaceDetails}
          inEmbedMode={this.props.inEmbedMode}
        />
      </div>
    );
  }

  renderSearchToolbar(isInert: boolean) {
    return (
      <SearchToolbar
        ref={searchToolbar => (this.searchToolbar = searchToolbar)}
        categories={this.props.categories}
        hidden={!this.props.isSearchBarVisible}
        inert={isInert}
        category={this.props.category}
        showCategoryMenu={!this.props.disableWheelmapSource}
        searchQuery={this.props.searchQuery}
        searchResults={this.props.searchResults}
        accessibilityFilter={this.props.accessibilityFilter}
        toiletFilter={this.props.toiletFilter}
        onChangeSearchQuery={this.props.onSearchQueryChange}
        onAccessibilityFilterButtonClick={this.props.onAccessibilityFilterButtonClick}
        onSearchResultClick={this.props.onSearchResultClick}
        onClick={this.props.onSearchToolbarClick}
        onSubmit={this.props.onSearchToolbarSubmit}
        onClose={this.props.onSearchToolbarClose}
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

  analyticsAllowedChangedHandler = (value: boolean) => {
    const { clientSideConfiguration } = this.props;
    const { googleAnalytics } = clientSideConfiguration.meta;

    this.setState({ analyticsAllowed: value });

    if (googleAnalytics.trackingId) {
      if (value) {
        enableAnalytics(googleAnalytics.trackingId);
      } else {
        disableAnalytics(googleAnalytics.trackingId);
      }
    }
  };

  renderOnboarding() {
    const { isOnboardingVisible, onCloseOnboarding, clientSideConfiguration } = this.props;
    const { analyticsAllowed } = this.state;
    const { headerMarkdown } = clientSideConfiguration.textContent.onboarding;
    const { googleAnalytics } = clientSideConfiguration.meta;
    const { logoURL } = clientSideConfiguration;

    const shouldShowAnalytics = !!(googleAnalytics && googleAnalytics.trackingId);

    return (
      <Onboarding
        isVisible={isOnboardingVisible}
        onClose={onCloseOnboarding}
        headerMarkdown={headerMarkdown}
        logoURL={logoURL}
        analyticsShown={shouldShowAnalytics}
        analyticsAllowed={analyticsAllowed}
        analyticsAllowedChanged={this.analyticsAllowedChangedHandler}
      />
    );
  }

  renderMainMenu() {
    const {
      logoURL,
      customMainMenuLinks,
      addPlaceURL,
      textContent,
    } = this.props.clientSideConfiguration;

    return (
      <MainMenu
        className="main-menu"
        isOpen={this.props.isMainMenuOpen}
        onToggle={this.props.onToggleMainMenu}
        onHomeClick={this.props.onMainMenuHomeClick}
        isLocalizationLoaded={this.props.isLocalizationLoaded}
        onAddMissingPlaceClick={this.props.onAddMissingPlaceClick}
        logoURL={logoURL}
        claim={textContent.product.claim}
        links={customMainMenuLinks}
        addPlaceURL={addPlaceURL}
        lat={this.props.lat}
        lon={this.props.lon}
        zoom={this.props.zoom}
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
        hidden={!this.props.isPhotoUploadInstructionsToolbarVisible}
        waitingForPhotoUpload={this.props.waitingForPhotoUpload}
        onClose={this.props.onAbortPhotoUploadFlow}
        onCompleted={this.props.onContinuePhotoUploadFlow}
        inEmbedMode={this.props.inEmbedMode}
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
      <FocusTrap
        active={this.props.modalNodeState === 'create'}
        component={CreatePlaceDialog}
        hidden={this.props.modalNodeState !== 'create'}
        onClose={this.props.onCloseCreatePlaceDialog}
        lat={this.props.lat}
        lon={this.props.lon}
      />
    );
  }

  renderMap() {
    const {
      lat,
      lon,
      zoom,
      category,
      featureId,
      equipmentInfoId,
      isNodeToolbarDisplayed: isNodeToolbarVisible,
    } = this.props;
    return (
      <DynamicMap
        forwardedRef={map => {
          this.map = map;
          if (typeof window !== 'undefined') {
            window.map = map;
          }
        }}
        onMoveEnd={this.props.onMoveEnd}
        onClick={this.props.onMapClick}
        onMarkerClick={this.props.onMarkerClick}
        hrefForFeature={hrefForFeature}
        onError={this.props.onError}
        lat={lat ? parseFloat(lat) : null}
        lon={lon ? parseFloat(lon) : null}
        zoom={zoom ? parseFloat(zoom) : null}
        extent={this.props.extent}
        includeSourceIds={this.props.includeSourceIds}
        excludeSourceIds={this.props.excludeSourceIds}
        disableWheelmapSource={this.props.disableWheelmapSource}
        category={category}
        feature={this.props.lightweightFeature || this.props.feature}
        featureId={featureId}
        equipmentInfo={this.props.equipmentInfo}
        equipmentInfoId={equipmentInfoId}
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
  }

  renderWheelmapHomeLink() {
    if (typeof window !== 'undefined') {
      const { clientSideConfiguration } = this.props;
      const appName = translatedStringFromObject(clientSideConfiguration.textContent.product.name);
      const logoURL = clientSideConfiguration.logoURL;

      const queryParams = queryString.parse(window.location.search);
      delete queryParams.embedded;
      const queryStringWithoutEmbeddedParam = queryString.stringify(queryParams);

      const homeLinkHref = `${window.location.origin}${
        window.location.pathname
      }?${queryStringWithoutEmbeddedParam}`;

      return <PositionedWheelmapHomeLink href={homeLinkHref} appName={appName} logoURL={logoURL} />;
    }
  }

  render() {
    const {
      featureId,
      className,
      isOnboardingVisible,
      isNotFoundVisible,
      isMainMenuOpen,
      isSearchBarVisible,
      isSearchButtonVisible,
      isNodeToolbarDisplayed: isNodeToolbarVisible,
      modalNodeState,
      isPhotoUploadCaptchaToolbarVisible,
      isPhotoUploadInstructionsToolbarVisible,
      photoMarkedForReport,
      isReportMode,
      inEmbedMode,
    } = this.props;

    const isNodeRoute = Boolean(featureId);

    const classList = uniq([
      'main-view',
      className,
      isOnboardingVisible ? 'is-dialog-visible' : null,
      isNotFoundVisible ? 'is-dialog-visible' : null,
      isMainMenuOpen ? 'is-main-menu-open' : null,
      isSearchBarVisible ? 'is-search-bar-visible' : null,
      isNodeToolbarVisible ? 'is-node-toolbar-visible' : null,
      modalNodeState ? 'is-dialog-visible' : null,
      modalNodeState ? 'is-modal' : null,
      isReportMode ? 'is-report-mode' : null,
      inEmbedMode ? 'in-embed-mode' : null,
    ]).filter(Boolean);

    const searchToolbarIsHidden =
      (isNodeRoute && this.state.isOnSmallViewport) ||
      isPhotoUploadCaptchaToolbarVisible ||
      isPhotoUploadInstructionsToolbarVisible ||
      isOnboardingVisible ||
      isNotFoundVisible ||
      !!photoMarkedForReport;

    const isMainMenuInBackground = isOnboardingVisible || isNotFoundVisible || modalNodeState;

    const searchToolbarIsInert: boolean = searchToolbarIsHidden || isMainMenuOpen;

    return (
      <div className={classList.join(' ')}>
        {!inEmbedMode && !isMainMenuInBackground && this.renderMainMenu()}
        <ErrorBoundary>
          <div className="behind-backdrop">
            {inEmbedMode && this.renderWheelmapHomeLink()}
            {!inEmbedMode && isMainMenuInBackground && this.renderMainMenu()}
            {!inEmbedMode && this.renderSearchToolbar(searchToolbarIsInert)}
            {isNodeToolbarVisible && !modalNodeState && this.renderNodeToolbar(isNodeRoute)}
            {!inEmbedMode && isSearchButtonVisible && this.renderSearchButton()}
            {this.renderMap()}
          </div>
          {this.renderFullscreenBackdrop()}
          {isNodeToolbarVisible && modalNodeState && this.renderNodeToolbar(isNodeRoute)}
          {isPhotoUploadCaptchaToolbarVisible && this.renderPhotoUploadCaptchaToolbar()}
          {isPhotoUploadInstructionsToolbarVisible && this.renderPhotoUploadInstructionsToolbar()}
          {photoMarkedForReport && this.renderReportPhotoToolbar()}
          {this.renderCreateDialog()}
          {this.renderOnboarding()}
        </ErrorBoundary>
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

const PositionedWheelmapHomeLink = styled(WheelmapHomeLink)`
  position: absolute;
  top: 10px;
  right: 70px;
  z-index: 1001;

  @media (max-width: 512px) {
    right: initial;
    left: 10px;
  }
`;

export default StyledMainView;
export { MainView as UnstyledMainView };
