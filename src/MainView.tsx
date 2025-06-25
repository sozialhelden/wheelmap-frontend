import * as React from 'react';
import dynamic from 'next/dynamic';

import styled from 'styled-components';
import uniq from 'lodash/uniq';
import * as queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import FocusTrap from 'focus-trap-react';
import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbarFeatureLoader from './components/NodeToolbar/NodeToolbarFeatureLoader';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import { PlaceFilter } from './components/SearchToolbar/AccessibilityFilterModel';
import ReportPhotoToolbar from './components/PhotoUpload/ReportPhotoToolbar';
import PhotoUploadInstructionsToolbar from './components/PhotoUpload/PhotoUploadInstructionsToolbar';
import MapLoading from './components/Map/MapLoading';
import ErrorBoundary from './components/ErrorBoundary';
import WheelmapHomeLink from './components/WheelmapHomeLink';
import { SearchResultFeature } from './lib/searchPlaces';
import { Feature, WheelmapFeature } from './lib/Feature';
import { EquipmentInfo } from './lib/EquipmentInfo';
import { translatedStringFromObject } from './lib/i18n';
import { Cluster } from './components/Map/Cluster';

import SearchButton from './components/SearchToolbar/SearchButton';
import Onboarding from './components/Onboarding/Onboarding';
import FullscreenBackdrop from './components/FullscreenBackdrop';

import config from './lib/config';
import colors from './lib/colors';

import { hasBigViewport, isOnSmallViewport } from './lib/ViewportSize';

import { NodeProperties, YesNoLimitedUnknown, YesNoUnknown } from './lib/Feature';

import { ModalNodeState } from './lib/ModalNodeState';

import { isTouchDevice, UAResult } from './lib/userAgent';

import { CategoryLookupTables } from './lib/Categories';
import { SearchResultCollection } from './lib/searchPlaces';
import { PlaceDetailsProps } from './app/PlaceDetailsProps';

import { PhotoModel } from './lib/PhotoModel';

import { App } from './lib/App';
import ContributionThanksDialog from './components/ContributionThanksDialog/ContributionThanksDialog';
import FeatureClusterPanel from './components/NodeToolbar/FeatureClusterPanel';
import { MappingEvent, MappingEvents } from './lib/MappingEvent';
import MappingEventsToolbar from './components/MappingEvents/MappingEventsToolbar';
import MappingEventToolbar from './components/MappingEvents/MappingEventToolbar';
import MappingEventWelcomeDialog from './components/MappingEvents/MappingEventWelcomeDialog';
import { AppContextConsumer } from './AppContext';
import CreatePlaceFlow from './components/CreatePlaceFlow/CreatePlaceFlow';
import { Position } from 'geojson';

type Props = {
  className?: string;

  category: string | null;
  categories: CategoryLookupTables;
  userAgent: UAResult;

  toiletFilter: YesNoUnknown[];
  accessibilityFilter: YesNoLimitedUnknown[];
  searchQuery: string | null;
  lat: number | null;
  lon: number | null;
  zoom: number | null;
  extent: [number, number, number, number] | null;
  inEmbedMode: boolean;

  includeSourceIds: Array<string>;
  excludeSourceIds: Array<string>;
  disableWheelmapSource: boolean | null;

  isReportMode: boolean | null;

  isOnboardingVisible: boolean;
  isMappingEventWelcomeDialogVisible: boolean;
  isMainMenuOpen: boolean;
  isNotFoundVisible: boolean;
  modalNodeState: ModalNodeState;
  isSearchBarVisible: boolean;
  isSearchToolbarExpanded: boolean;
  isSearchButtonVisible: boolean;
  isNodeToolbarDisplayed: boolean;
  shouldLocateOnStart: boolean;
  searchResults: SearchResultCollection | Promise<SearchResultCollection> | null;

  onSearchResultClick: (
    feature: SearchResultFeature,
    wheelmapFeature: WheelmapFeature | null
  ) => void;
  onSearchToolbarClick: () => void;
  onSearchToolbarClose: () => void;
  onSearchToolbarSubmit: (searchQuery: string) => void;
  onClickSearchButton: () => void;
  onToggleMainMenu: () => void;
  onMainMenuHomeClick: () => void;
  onClickFullscreenBackdrop: () => void;
  onMoveEnd: () => void;
  onMapClick: () => void;
  onMarkerClick: (featureId: string, properties?: NodeProperties | null) => void;
  onMappingEventClick: (eventId: string) => void;
  onError: () => void;
  onCloseNodeToolbar: () => void;
  onCloseMappingEventsToolbar: () => void;
  onOpenReportMode: () => void;
  onAbortReportPhotoFlow: () => void;
  onCloseOnboarding: () => void;
  onCloseModalDialog: () => void;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletAccessibility: () => void;
  onCloseWheelchairAccessibility: () => void;
  onCloseToiletAccessibility: () => void;
  onOpenToiletNearby: () => void;
  onSearchQueryChange: (searchQuery: string) => void;
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void;
  onShowPlaceDetails: (featureId: string | number) => void;

  // simple 3-button status editor feature
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void;
  onAccessibilityFilterButtonClick: (filter: PlaceFilter) => void;
  accessibilityPresetStatus?: YesNoLimitedUnknown;

  // photo feature
  isPhotoUploadInstructionsToolbarVisible: boolean;
  onStartPhotoUploadFlow: () => void;
  onAbortPhotoUploadFlow: () => void;
  onContinuePhotoUploadFlow: (photos: FileList) => void;
  onFinishPhotoUploadFlow: (photos: FileList) => void;
  onStartReportPhotoFlow: (photo: PhotoModel) => void;
  onFinishReportPhotoFlow: (photo: PhotoModel, reason: string) => void;
  photosMarkedForUpload: FileList | null;
  waitingForPhotoUpload?: boolean;
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview';
  photoFlowErrorMessage: string | null;
  photoMarkedForReport: PhotoModel | null;

  // cluster feature
  activeCluster?: Cluster;
  onClusterClick: (cluster: Cluster) => void;
  onCloseClusterPanel: () => void;
  onSelectFeatureFromCluster: (feature: Feature | EquipmentInfo) => void;

  app: App;

  // mapping event
  invitationToken: string;
  mappingEvents: MappingEvents;
  mappingEvent: MappingEvent | null;
  joinedMappingEventId: string | null;
  joinedMappingEvent?: MappingEvent;
  isMappingEventsToolbarVisible: boolean;
  isMappingEventToolbarVisible: boolean;
  onMappingEventsLinkClick: () => void;
  onMappingEventJoin: (mappingEventId: string, emailAddress?: string) => void;
  onMappingEventLeave: () => void;
  onMappingEventWelcomeDialogOpen: () => void;
  onMappingEventWelcomeDialogClose: () => void;
  mappingEventHandlers: {
    updateJoinedMappingEvent: (joinedMappingEventId: string | null) => void;
  };
} & PlaceDetailsProps;

type State = {
  isOnSmallViewport: boolean;
  uniqueSurveyId: string;
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

const DynamicMap = dynamic(import('./components/Map/Map'), {
  ssr: false,
  loading: () => <MapLoading />,
});

class MainView extends React.Component<Props, State> {
  props: Props;

  state: State = {
    isOnSmallViewport: isOnSmallViewport(),
    uniqueSurveyId: uuidv4(),
  };

  map: { focus: () => void; snapToFeature: () => void } | null;

  lastFocusedElement: HTMLElement | null;
  nodeToolbar: NodeToolbarFeatureLoader | null;
  searchToolbar: SearchToolbar | null;
  photoUploadInstructionsToolbar: PhotoUploadInstructionsToolbar | null;

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

  onMappingEventHeaderClick = () => {
    this.map && this.map.snapToFeature();
  };

  onAddPlaceViaCustomLinkClick = () => {
    this.setState(() => ({ uniqueSurveyId: uuidv4() }));
  };

  getMinimalNodeToolbarTopPosition() {
    return this.props.inEmbedMode ? (this.state.isOnSmallViewport ? 92 : 0) : 120;
  }

  getMinimalToolbarTopPosition() {
    return this.props.inEmbedMode
      ? this.state.isOnSmallViewport
        ? 92
        : 0
      : this.state.isOnSmallViewport
      ? 50
      : 60;
  }

  renderNodeToolbar(isNodeRoute: boolean) {
    return (
      <div className="node-toolbar">
        <NodeToolbarFeatureLoader
          joinedMappingEventId={this.props.joinedMappingEventId}
          joinedMappingEvent={this.props.joinedMappingEvent}
          featureId={this.props.featureId}
          equipmentInfoId={this.props.equipmentInfoId}
          cluster={this.props.activeCluster}
          childPlaceInfos={this.props.childPlaceInfos}
          modalNodeState={this.props.modalNodeState}
          accessibilityPresetStatus={this.props.accessibilityPresetStatus}
          ref={nodeToolbar => (this.nodeToolbar = nodeToolbar)}
          lightweightFeature={this.props.lightweightFeature}
          feature={this.props.feature}
          equipmentInfo={this.props.equipmentInfo}
          categories={this.props.categories}
          sources={this.props.sources}
          photos={this.props.photos}
          toiletsNearby={this.props.toiletsNearby}
          onOpenWheelchairAccessibility={this.props.onOpenWheelchairAccessibility}
          onOpenToiletAccessibility={this.props.onOpenToiletAccessibility}
          onOpenToiletNearby={this.props.onOpenToiletNearby}
          onSelectWheelchairAccessibility={this.props.onSelectWheelchairAccessibility}
          onCloseWheelchairAccessibility={this.props.onCloseWheelchairAccessibility}
          onCloseToiletAccessibility={this.props.onCloseToiletAccessibility}
          hidden={!isNodeRoute}
          photoFlowNotification={this.props.photoFlowNotification}
          photoFlowErrorMessage={this.props.photoFlowErrorMessage}
          onOpenReportMode={this.props.onOpenReportMode}
          onStartPhotoUploadFlow={this.props.onStartPhotoUploadFlow}
          onClickCurrentCluster={this.props.onCloseNodeToolbar}
          onClickCurrentMarkerIcon={this.onClickCurrentMarkerIcon}
          onClose={this.props.onCloseNodeToolbar}
          onReportPhoto={this.props.onStartReportPhotoFlow}
          onEquipmentSelected={this.props.onEquipmentSelected}
          onShowPlaceDetails={this.props.onShowPlaceDetails}
          inEmbedMode={this.props.inEmbedMode}
          userAgent={this.props.userAgent}
          minimalTopPosition={this.getMinimalNodeToolbarTopPosition()}
          renderContext={this.props.renderContext}
        />
      </div>
    );
  }

  renderMappingEventsToolbar() {
    const { mappingEvents, onCloseMappingEventsToolbar, onMappingEventClick, app } = this.props;
    return (
      <MappingEventsToolbar
        app={app}
        mappingEvents={mappingEvents}
        onClose={onCloseMappingEventsToolbar}
        onMappingEventClick={onMappingEventClick}
        minimalTopPosition={this.getMinimalToolbarTopPosition()}
      />
    );
  }

  renderMappingEventToolbar() {
    const {
      mappingEvent,
      joinedMappingEventId,
      onMappingEventLeave,
      onMappingEventWelcomeDialogOpen,
      onCloseMappingEventsToolbar,
      app,
      mappingEventHandlers,
    } = this.props;

    if (!mappingEvent) {
      return null;
    }

    const productName = app.clientSideConfiguration.textContent.product.name;
    const translatedProductName = translatedStringFromObject(productName);

    const focusTrapActive = !this.isAnyDialogVisible();

    return (
      <AppContextConsumer>
        {({ preferredLanguage }) => (
          <MappingEventToolbar
            mappingEventHandlers={mappingEventHandlers}
            mappingEvent={mappingEvent}
            joinedMappingEventId={joinedMappingEventId}
            onMappingEventWelcomeDialogOpen={onMappingEventWelcomeDialogOpen}
            onMappingEventLeave={onMappingEventLeave}
            onClose={onCloseMappingEventsToolbar}
            onHeaderClick={this.onMappingEventHeaderClick}
            productName={translatedProductName}
            focusTrapActive={focusTrapActive}
            preferredLanguage={preferredLanguage}
            minimalTopPosition={this.getMinimalToolbarTopPosition()}
          />
        )}
      </AppContextConsumer>
    );
  }

  renderClusterPanel() {
    return (
      <div className="toolbar">
        <FeatureClusterPanel
          hidden={!this.props.activeCluster}
          inEmbedMode={this.props.inEmbedMode}
          cluster={this.props.activeCluster}
          categories={this.props.categories}
          onClose={this.props.onCloseClusterPanel}
          onSelectClusterIcon={this.onClickCurrentMarkerIcon}
          onFeatureSelected={this.props.onSelectFeatureFromCluster}
          minimalTopPosition={this.getMinimalNodeToolbarTopPosition()}
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
        showCategoryMenu={true}
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
        minimalTopPosition={this.getMinimalToolbarTopPosition()}
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
      />
    );
  }

  renderOnboarding() {
    const {
      isOnboardingVisible,
      onCloseOnboarding,
      app,
      isMappingEventWelcomeDialogVisible,
    } = this.props;
    const { clientSideConfiguration } = app;

    // if mapping event welcome dialog is also visible, don't show onboarding dialog
    const isVisible = !isMappingEventWelcomeDialogVisible && isOnboardingVisible;

    return (
      <Onboarding
        isVisible={isVisible}
        onClose={onCloseOnboarding}
        clientSideConfiguration={clientSideConfiguration}
      />
    );
  }

  renderMainMenu() {
    return (
      <MainMenu
        className="main-menu"
        uniqueSurveyId={this.state.uniqueSurveyId}
        isOpen={this.props.isMainMenuOpen}
        onToggle={this.props.onToggleMainMenu}
        onHomeClick={this.props.onMainMenuHomeClick}
        onMappingEventsLinkClick={this.props.onMappingEventsLinkClick}
        onAddPlaceViaCustomLinkClick={this.onAddPlaceViaCustomLinkClick}
        joinedMappingEvent={this.props.joinedMappingEvent}
        clientSideConfiguration={this.props.app.clientSideConfiguration}
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
      this.props.isMappingEventWelcomeDialogVisible ||
      this.props.isNotFoundVisible ||
      this.props.modalNodeState !== null ||
      this.props.isPhotoUploadInstructionsToolbarVisible ||
      Boolean(this.props.photoMarkedForReport);

    return (
      <FullscreenBackdrop onClick={this.props.onClickFullscreenBackdrop} isActive={isActive} />
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

  renderCreateFlow() {
    if (this.props.modalNodeState !== 'create') {
      return null;
    }

    return (
      <CreatePlaceFlow
        onSubmit={id => {
          this.props.onCloseModalDialog();
          if (id) {
            this.props.onMarkerClick(id);
          }
        }}
        onCancel={place => {
          this.props.onCloseModalDialog();
          if (place) {
            this.props.onSearchResultClick(place.searchResult, place.wheelmapFeature);
          }
        }}
      />
    );
  }

  renderContributionThanksDialog() {
    return (
      <AppContextConsumer>
        {appContext => {
          return (
            <FocusTrap active={this.props.modalNodeState === 'contribution-thanks'}>
              <ContributionThanksDialog
                hidden={this.props.modalNodeState !== 'contribution-thanks'}
                onClose={this.props.onCloseModalDialog}
                appContext={appContext}
                featureId={this.props.featureId as string}
                onSelectFeature={id => {
                  this.props.onCloseModalDialog();
                  this.props.onMarkerClick(id);
                }}
              />
            </FocusTrap>
          );
        }}
      </AppContextConsumer>
    );
  }

  renderMap() {
    const {
      lat,
      lon,
      zoom,
      category: categoryId,
      featureId,
      equipmentInfoId,
      isNodeToolbarDisplayed: isNodeToolbarVisible,
      inEmbedMode,
    } = this.props;

    function getDefaultStartCenterForApp(app: App): number[] {
      const associatedCenter = app?.clientSideConfiguration?.associatedGeometries?.centerPoint?.coordinates;  
      return (associatedCenter && [...associatedCenter].reverse() || config.defaultStartCenter);
    }

    return (
      <DynamicMap
        forwardedRef={map => {
          this.map = map;
          if (typeof window !== 'undefined') {
            // @ts-ignore
            window.map = map;
          }
        }}
        accessibilityCloudAppToken={this.props.app.tokenString}
        onMoveEnd={this.props.onMoveEnd}
        onClick={this.props.onMapClick}
        onMarkerClick={this.props.onMarkerClick}
        onClusterClick={this.props.onClusterClick}
        onMappingEventClick={this.props.onMappingEventClick}
        onError={this.props.onError}
        lat={lat}
        lon={lon}
        zoom={zoom}
        extent={this.props.extent}
        includeSourceIds={this.props.includeSourceIds}
        excludeSourceIds={this.props.excludeSourceIds}
        disableWheelmapSource={this.props.disableWheelmapSource}
        activeCluster={this.props.activeCluster}
        categoryId={categoryId}
        feature={this.props.lightweightFeature || this.props.feature}
        featureId={featureId}
        mappingEvents={this.props.mappingEvents}
        mappingEvent={this.props.mappingEvent}
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
        inEmbedMode={inEmbedMode}
        {...config}
        defaultStartCenter={getDefaultStartCenterForApp(this.props.app)}
      />
    );
  }

  renderWheelmapHomeLink() {
    if (typeof window !== 'undefined') {
      const { clientSideConfiguration } = this.props.app;

      const queryParams = queryString.parse(window.location.search);
      delete queryParams.embedded;
      const queryStringWithoutEmbeddedParam = queryString.stringify(queryParams);

      const homeLinkHref = `${window.location.origin}${window.location.pathname}?${queryStringWithoutEmbeddedParam}`;

      return (
        <PositionedWheelmapHomeLink
          href={homeLinkHref}
          clientSideConfiguration={clientSideConfiguration}
        />
      );
    }
  }

  renderMappingEventWelcomeDialog() {
    const {
      mappingEvent,
      onMappingEventJoin,
      onMappingEventWelcomeDialogClose,
      invitationToken,
    } = this.props;

    if (!mappingEvent) {
      return null;
    }

    return (
      <MappingEventWelcomeDialog
        mappingEvent={mappingEvent}
        onJoin={onMappingEventJoin}
        onClose={onMappingEventWelcomeDialogClose}
        invitationToken={invitationToken}
      />
    );
  }

  isAnyDialogVisible(): boolean {
    return !!(
      this.props.isOnboardingVisible ||
      this.props.isMappingEventWelcomeDialogVisible ||
      this.props.isNotFoundVisible ||
      this.props.modalNodeState ||
      this.props.isPhotoUploadInstructionsToolbarVisible ||
      Boolean(this.props.photoMarkedForReport)
    );
  }

  render() {
    const {
      featureId,
      className,
      isOnboardingVisible,
      isMappingEventWelcomeDialogVisible,
      isNotFoundVisible,
      isMainMenuOpen,
      isSearchBarVisible,
      isSearchButtonVisible,
      isNodeToolbarDisplayed: isNodeToolbarVisible,
      isMappingEventsToolbarVisible,
      isMappingEventToolbarVisible,
      modalNodeState,
      isPhotoUploadInstructionsToolbarVisible,
      photoMarkedForReport,
      isReportMode,
      inEmbedMode,
    } = this.props;

    const isNodeRoute = Boolean(featureId);
    const isDialogVisible = this.isAnyDialogVisible();
    const isMainMenuInBackground = isDialogVisible;

    const classList = uniq([
      'main-view',
      className,
      isDialogVisible ? 'is-dialog-visible' : null,
      isMainMenuOpen ? 'is-main-menu-open' : null,
      isSearchBarVisible ? 'is-search-bar-visible' : null,
      isNodeToolbarVisible ? 'is-node-toolbar-visible' : null,
      modalNodeState ? 'is-modal' : null,
      isReportMode ? 'is-report-mode' : null,
      inEmbedMode ? 'in-embed-mode' : null,
    ]).filter(Boolean);

    const searchToolbarIsHidden =
      (isNodeRoute && this.state.isOnSmallViewport) ||
      isPhotoUploadInstructionsToolbarVisible ||
      isOnboardingVisible ||
      isNotFoundVisible ||
      !!photoMarkedForReport;

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
            {isMappingEventsToolbarVisible && this.renderMappingEventsToolbar()}
            {isMappingEventToolbarVisible && this.renderMappingEventToolbar()}
            {!isNodeToolbarVisible && this.renderClusterPanel()}
            {!inEmbedMode && isSearchButtonVisible && this.renderSearchButton()}
            {this.renderMap()}
          </div>
          {this.renderFullscreenBackdrop()}
          {isNodeToolbarVisible && modalNodeState && this.renderNodeToolbar(isNodeRoute)}
          {isPhotoUploadInstructionsToolbarVisible && this.renderPhotoUploadInstructionsToolbar()}
          {photoMarkedForReport && this.renderReportPhotoToolbar()}
          {this.renderCreateFlow()}
          {this.renderContributionThanksDialog()}
          {this.renderOnboarding()}
          {isMappingEventWelcomeDialogVisible && this.renderMappingEventWelcomeDialog()}
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
    transition: transform 0.3s ease-out, opacity 0.1s ease-out;
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
      border-radius: 30px;
      overflow: hidden;
      filter: blur(15px);
      .toolbar {
        z-index: 999;
      }
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
