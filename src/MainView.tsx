import * as React from 'react';
import dynamic from 'next/dynamic';
import uuidv4 from 'uuid/v4';

import styled from 'styled-components';
import includes from 'lodash/includes';
import uniq from 'lodash/uniq';
import find from 'lodash/find';
import queryString from 'query-string';
import FocusTrap from 'focus-trap-react';

import MainMenu from './components/MainMenu/MainMenu';
import NodeToolbarFeatureLoader from './components/NodeToolbar/NodeToolbarFeatureLoader';
import SearchToolbar from './components/SearchToolbar/SearchToolbar';
import { PlaceFilter } from './components/SearchToolbar/AccessibilityFilterModel';
import CreatePlaceDialog from './components/CreatePlaceDialog/CreatePlaceDialog';
import ReportPhotoToolbar from './components/PhotoUpload/ReportPhotoToolbar';
import PhotoUploadCaptchaToolbar from './components/PhotoUpload/PhotoUploadCaptchaToolbar';
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

import { hasAllowedAnalytics } from './lib/savedState';
import { App } from './lib/App';
import { enableAnalytics, disableAnalytics } from './lib/Analytics';
import ContributionThanksDialog from './components/ContributionThanksDialog/ContributionThanksDialog';
import { insertPlaceholdersToAddPlaceUrl } from './lib/insertPlaceholdersToAddPlaceUrl';
import FeatureClusterPanel from './components/NodeToolbar/FeatureClusterPanel';
import { MappingEvent, MappingEvents } from './lib/MappingEvent';
import MappingEventsToolbar from './components/MappingEvents/MappingEventsToolbar';
import MappingEventToolbar from './components/MappingEvents/MappingEventToolbar';
import MappingEventWelcomeDialog from './components/MappingEvents/MappingEventWelcomeDialog';
import { AppContextConsumer } from './AppContext';

type Props = {
  className?: string,

  category: string | null,
  categories: CategoryLookupTables,
  userAgent: UAResult,

  toiletFilter: YesNoUnknown[],
  accessibilityFilter: YesNoLimitedUnknown[],
  searchQuery: string | null,
  lat: number | null,
  lon: number | null,
  zoom: number | null,
  extent: [number, number, number, number] | null,
  inEmbedMode: boolean,

  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  disableWheelmapSource: boolean | null,

  isReportMode: boolean | null,

  isOnboardingVisible: boolean,
  isMappingEventWelcomeDialogVisible: boolean,
  isMainMenuOpen: boolean,
  isNotFoundVisible: boolean,
  modalNodeState: ModalNodeState,
  isSearchBarVisible: boolean,
  isSearchToolbarExpanded: boolean,
  isSearchButtonVisible: boolean,
  isNodeToolbarDisplayed: boolean,
  shouldLocateOnStart: boolean,
  searchResults: SearchResultCollection | Promise<SearchResultCollection> | null,

  onSearchResultClick: (feature: SearchResultFeature, wheelmapFeature: WheelmapFeature | null) => void,
  onSearchToolbarClick: () => void,
  onSearchToolbarClose: () => void,
  onSearchToolbarSubmit: (searchQuery: string) => void,
  onClickSearchButton: () => void,
  onToggleMainMenu: () => void,
  onMainMenuHomeClick: () => void,
  onClickFullscreenBackdrop: () => void,
  onMoveEnd: () => void,
  onMapClick: () => void,
  onMarkerClick: (featureId: string, properties: NodeProperties | null) => void,
  onMappingEventClick: (eventId: string) => void,
  onError: () => void,
  onCloseNodeToolbar: () => void,
  onCloseMappingEventsToolbar: () => void,
  onOpenReportMode: () => void,
  onAbortReportPhotoFlow: () => void,
  onCloseOnboarding: () => void,
  onCloseModalDialog: () => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletAccessibility: () => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
  onOpenToiletNearby: () => void,
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
  onFinishReportPhotoFlow: (photo: PhotoModel, reason: string) => void,
  photosMarkedForUpload: FileList | null,
  waitingForPhotoUpload?: boolean,
  photoCaptchaFailed?: boolean,
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview',
  photoFlowErrorMessage: string | null,
  photoMarkedForReport: PhotoModel | null,

  // cluster feature
  activeCluster?: Cluster,
  onClusterClick: (cluster: Cluster) => void,
  onCloseClusterPanel: () => void,
  onSelectFeatureFromCluster: (feature: Feature | EquipmentInfo) => void,

  app: App,

  // mapping event
  invitationToken: string,
  mappingEvents: MappingEvents,
  mappingEvent: MappingEvent | null,
  joinedMappingEventId: string | null,
  joinedMappingEvent?: MappingEvent,
  isMappingEventsToolbarVisible: boolean,
  isMappingEventToolbarVisible: boolean,
  onMappingEventsLinkClick: () => void,
  onMappingEventJoin: (mappingEventId: string, emailAddress?: string) => void,
  onMappingEventLeave: () => void,
  onMappingEventWelcomeDialogOpen: () => void,
  onMappingEventWelcomeDialogClose: () => void,
  mappingEventHandlers: {
    updateJoinedMappingEvent: (joinedMappingEventId: string | null) => void,
  }
} & PlaceDetailsProps;

type State = {
  isOnSmallViewport: boolean,
  analyticsAllowed: boolean,
  uniqueSurveyId: string,
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
    analyticsAllowed: hasAllowedAnalytics(),
    uniqueSurveyId: uuidv4(),
  };

  map: { focus: () => void, snapToFeature: () => void } | null;

  lastFocusedElement: HTMLElement | null;
  nodeToolbar: NodeToolbarFeatureLoader | null;
  searchToolbar: SearchToolbar | null;
  photoUploadCaptchaToolbar: PhotoUploadCaptchaToolbar | null;
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

  onAddPlaceLinkClick = () => {
    this.setState(() => ({ uniqueSurveyId: uuidv4() }));
  };

  renderNodeToolbar(isNodeRoute: boolean) {
    return (
      <div className="node-toolbar">
        <NodeToolbarFeatureLoader
          featureId={this.props.featureId}
          equipmentInfoId={this.props.equipmentInfoId}
          cluster={this.props.activeCluster}
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
            mappingEvent={mappingEvent}
            joinedMappingEventId={joinedMappingEventId}
            onMappingEventWelcomeDialogOpen={onMappingEventWelcomeDialogOpen}
            onMappingEventLeave={onMappingEventLeave}
            onClose={onCloseMappingEventsToolbar}
            onHeaderClick={this.onMappingEventHeaderClick}
            productName={translatedProductName}
            focusTrapActive={focusTrapActive}
            preferredLanguage={preferredLanguage}
            mappingEventHandlers={mappingEventHandlers}
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
      />
    );
  }

  analyticsAllowedChangedHandler = (value: boolean) => {
    const googleAnalytics = this.props.app.clientSideConfiguration.meta.googleAnalytics;

    this.setState({ analyticsAllowed: value });

    if (googleAnalytics && googleAnalytics.trackingId) {
      if (value) {
        enableAnalytics(googleAnalytics.trackingId);
      } else {
        disableAnalytics(googleAnalytics.trackingId);
      }
    }
  };

  renderOnboarding() {
    const {
      isOnboardingVisible,
      onCloseOnboarding,
      app,
      isMappingEventWelcomeDialogVisible,
    } = this.props;
    const { analyticsAllowed } = this.state;
    const { clientSideConfiguration } = app;
    const { headerMarkdown } = clientSideConfiguration.textContent.onboarding;
    const { googleAnalytics } = clientSideConfiguration.meta;
    const { logoURL } = clientSideConfiguration;

    const shouldShowAnalytics = !!(googleAnalytics && googleAnalytics.trackingId);

    // if mapping event welcome dialog is also visible, don't show onboarding dialog
    const isVisible = !isMappingEventWelcomeDialogVisible && isOnboardingVisible;

    return (
      <Onboarding
        isVisible={isVisible}
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
      customMainMenuLinks,
      logoURL,
      addPlaceURL,
      textContent,
    } = this.props.app.clientSideConfiguration;

    return (
      <MainMenu
        productName={translatedStringFromObject(textContent.product.name)}
        className="main-menu"
        uniqueSurveyId={this.state.uniqueSurveyId}
        isOpen={this.props.isMainMenuOpen}
        onToggle={this.props.onToggleMainMenu}
        onHomeClick={this.props.onMainMenuHomeClick}
        onMappingEventsLinkClick={this.props.onMappingEventsLinkClick}
        joinedMappingEvent={this.props.joinedMappingEvent}
        logoURL={logoURL}
        claim={textContent.product.claim}
        links={customMainMenuLinks}
        lat={this.props.lat}
        lon={this.props.lon}
        zoom={this.props.zoom}
        onAddPlaceLinkClick={this.onAddPlaceLinkClick}
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
      (this.props.modalNodeState !== null) ||
      this.props.isPhotoUploadCaptchaToolbarVisible ||
      this.props.isPhotoUploadInstructionsToolbarVisible ||
      Boolean(this.props.photoMarkedForReport);

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
        appToken={this.props.app.tokenString}
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
      <FocusTrap active={this.props.modalNodeState === 'create'}>
        <CreatePlaceDialog
          hidden={this.props.modalNodeState !== 'create'}
          onClose={this.props.onCloseModalDialog}
          lat={this.props.lat}
          lon={this.props.lon}
        />
      </FocusTrap>
    );
  }

  renderContributionThanksDialog() {
    const { customMainMenuLinks } = this.props.app.clientSideConfiguration;

    // find add place link
    const link = find(customMainMenuLinks, link => includes(link.tags, 'add-place'));

    return (
      <AppContextConsumer>
        {appContext => {
          const url = link
            ? insertPlaceholdersToAddPlaceUrl(
                appContext.baseUrl,
                translatedStringFromObject(link.url) || '',
                this.state.uniqueSurveyId
              )
            : null;

          return (
            <FocusTrap active={this.props.modalNodeState === 'contribution-thanks'}>
              <ContributionThanksDialog
                hidden={this.props.modalNodeState !== 'contribution-thanks'}
                onClose={this.props.onCloseModalDialog}
                addPlaceUrl={url}
                onAddPlaceLinkClick={this.onAddPlaceLinkClick}
                appContext={appContext}
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
      />
    );
  }

  renderWheelmapHomeLink() {
    if (typeof window !== 'undefined') {
      const { clientSideConfiguration } = this.props.app;
      const appName = translatedStringFromObject(clientSideConfiguration.textContent.product.name);
      const { logoURL } = clientSideConfiguration;

      const queryParams = queryString.parse(window.location.search);
      delete queryParams.embedded;
      const queryStringWithoutEmbeddedParam = queryString.stringify(queryParams);

      const homeLinkHref = `${window.location.origin}${window.location.pathname}?${queryStringWithoutEmbeddedParam}`;

      return <PositionedWheelmapHomeLink href={homeLinkHref} appName={appName} logoURL={logoURL} />;
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
      this.props.isPhotoUploadCaptchaToolbarVisible ||
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
      isPhotoUploadCaptchaToolbarVisible,
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
      isPhotoUploadCaptchaToolbarVisible ||
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
          {isPhotoUploadCaptchaToolbarVisible && this.renderPhotoUploadCaptchaToolbar()}
          {isPhotoUploadInstructionsToolbarVisible && this.renderPhotoUploadInstructionsToolbar()}
          {photoMarkedForReport && this.renderReportPhotoToolbar()}
          {this.renderCreateDialog()}
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
