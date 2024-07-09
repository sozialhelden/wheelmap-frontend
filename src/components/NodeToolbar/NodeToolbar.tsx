import FocusTrap from "focus-trap-react";
import fromPairs from "lodash/fromPairs";
import get from "lodash/get";
import includes from "lodash/includes";
import * as React from "react";
import styled from "styled-components";
import { t } from "ttag";

import Button from "../Button";
import CloseLink from "../CloseLink";
import ErrorBoundary from "../ErrorBoundary";
import EquipmentAccessibility from "./AccessibilitySection/EquipmentAccessibility";
import PlaceAccessibilitySection from "./AccessibilitySection/PlaceAccessibilitySection";
import EquipmentOverview from "./Equipment/EquipmentOverview";
import NodeHeader from "./NodeHeader";
import PhotoSection from "./Photos/PhotoSection";
import ReportDialog from "./Report/ReportDialog";
import SourceList from "./SourceList";
import StyledToolbar from "./StyledToolbar";

import { Feature, WheelmapFeature, YesNoLimitedUnknown, accessibilityCloudFeatureFrom, getFeatureId, isWheelchairAccessible, isWheelmapFeatureId, placeNameFor, wheelmapFeatureFrom } from "../../lib/Feature";
import { PhotoModel } from "../../lib/PhotoModel";

import { Dictionary, sortBy } from "lodash";
import { AppContextConsumer } from "../../AppContext";
import { SourceWithLicense } from "../../app/PlaceDetailsProps";
import Categories, { Category, CategoryLookupTables, categoryNameFor } from "../../lib/Categories";
import { EquipmentInfo } from "../../lib/EquipmentInfo";
import { MappingEvent } from "../../lib/MappingEvent";
import { ModalNodeState } from "../../lib/ModalNodeState";
import { equipmentInfoCache } from "../../lib/cache/EquipmentInfoCache";
import { translatedStringFromObject } from "../../lib/i18n";
import { UAResult } from "../../lib/userAgent";
import CategoryIcon from "../Icon";
import Link, { RouteConsumer } from "../Link/Link";
import { Cluster } from "../Map/Cluster";
import InlineWheelchairAccessibilityEditor from "./AccessibilityEditor/InlineWheelchairAccessibilityEditor";
import ToiletStatusEditor from "./AccessibilityEditor/ToiletStatusEditor";
import WheelchairStatusEditor from "./AccessibilityEditor/WheelchairStatusEditor";
import isA11yEditable from "./AccessibilityEditor/isA11yEditable";
import ConfigurableExternalLinks from "./IconButtonList/ConfigurableExternalLinks";
import IconButtonList, { StyledIconButtonList } from "./IconButtonList/IconButtonList";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

type Props = {
  equipmentInfoId: string | null;
  equipmentInfo: EquipmentInfo | null;
  feature: Feature;
  featureId: string | number;
  cluster: Cluster | null;
  sources: SourceWithLicense[];
  childPlaceInfos: Feature[] | null;
  photos: PhotoModel[];
  toiletsNearby: Feature[] | null;
  categories: CategoryLookupTables;
  category: Category | null;
  parentCategory: Category | null;
  hidden: boolean;
  modalNodeState: ModalNodeState;
  userAgent: UAResult;
  minimalTopPosition: number;
  joinedMappingEvent?: MappingEvent;
  onClose: () => void;
  onOpenReportMode: () => void | null;
  onOpenToiletAccessibility: () => void;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletNearby: (feature: Feature) => void;
  onCloseWheelchairAccessibility: () => void;
  onCloseToiletAccessibility: () => void;
  onClickCurrentCluster?: (cluster: Cluster) => void;
  onShowPlaceDetails?: (featureId: string | number) => void;
  // Simple 3-button wheelchair status editor
  accessibilityPresetStatus?: YesNoLimitedUnknown | null;
  onSelectWheelchairAccessibility?: (value: YesNoLimitedUnknown) => void;
  onEquipmentSelected?: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void;

  // photo feature
  onStartPhotoUploadFlow: () => void;
  onReportPhoto: (photo: PhotoModel) => void;
  photoFlowNotification?: "uploadProgress" | "uploadFailed" | "reported" | "waitingForReview";
  photoFlowErrorMessage: string | null;
  onClickCurrentMarkerIcon?: (feature: Feature) => void;
};

type State = {
  shouldCloseOnEscape: boolean;
};

class NodeToolbar extends React.PureComponent<Props, State> {
  toolbar = React.createRef<HTMLElement>();

  reportDialog: React.ElementRef<typeof ReportDialog> | null;
  state = {
    shouldCloseOnEscape: false,
  };

  componentDidMount() {
    this.toolbar.current.setAttribute("tabindex", "-1");
  }

  placeName() {
    return placeNameFor(get(this.props, "feature.properties"), this.props.category);
  }

  focus() {
    this.toolbar.current?.focus();
  }

  onLightboxStateChange = (isLightboxOpen: boolean) => {
    this.setState({ shouldCloseOnEscape: !isLightboxOpen });
  };

  renderReportDialog() {
    return (
      <AppContextConsumer>
        {(appContext) => (
          <ReportDialog
            appContext={appContext}
            categories={this.props.categories}
            feature={this.props.feature}
            featureId={this.props.featureId}
            onClose={() => {
              if (this.props.onClose) this.props.onClose();
            }}
          />
        )}
      </AppContextConsumer>
    );
  }

  renderIconButtonList() {
    return <IconButtonList {...this.props} />;
  }

  renderNodeHeader() {
    const { feature, equipmentInfo, equipmentInfoId, cluster, category, categories, parentCategory, onClickCurrentMarkerIcon, onClickCurrentCluster } = this.props;

    const statesWithIcon = ["edit-toilet-accessibility", "report"];
    const isModalStateWithPlaceIcon = includes(statesWithIcon, this.props.modalNodeState);
    const hasIcon = !this.props.modalNodeState || isModalStateWithPlaceIcon;

    return (
      <NodeHeader feature={feature} categories={categories} equipmentInfo={equipmentInfo} equipmentInfoId={equipmentInfoId} cluster={cluster} category={category} parentCategory={parentCategory} onClickCurrentCluster={onClickCurrentCluster} onClickCurrentMarkerIcon={onClickCurrentMarkerIcon} hasIcon={hasIcon}>
        {this.renderCloseLink()}
      </NodeHeader>
    );
  }

  renderPhotoSection() {
    return <PhotoSection featureId={this.props.featureId as any} photos={this.props.photos || []} onReportPhoto={this.props.onReportPhoto} onStartPhotoUploadFlow={this.props.onStartPhotoUploadFlow} photoFlowNotification={this.props.photoFlowNotification} photoFlowErrorMessage={this.props.photoFlowErrorMessage} onLightbox={this.onLightboxStateChange} />;
  }

  renderPlaceNameForEquipment() {
    const { featureId } = this.props;
    if (!featureId) return;

    return (
      <Button
        className="link-button"
        onClick={(e) => {
          if (this.props.onShowPlaceDetails) {
            this.props.onShowPlaceDetails(this.props.featureId);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {this.placeName()}
      </Button>
    );
  }

  renderToiletAccessibilityEditor() {
    return (
      <ToiletStatusEditor
        categories={this.props.categories}
        featureId={this.props.featureId as any}
        feature={this.props.feature}
        onSave={() => {
          this.props.onClose();
          this.props.onCloseToiletAccessibility();
        }}
        onClose={this.props.onClose}
      />
    );
  }

  renderWheelchairAccessibilityEditor() {
    return (
      <WheelchairStatusEditor
        categories={this.props.categories}
        featureId={this.props.featureId as any}
        feature={this.props.feature}
        onSave={() => {
          this.props.onClose();
          this.props.onCloseWheelchairAccessibility();
        }}
        presetStatus={this.props.accessibilityPresetStatus}
        onClose={this.props.onClose}
      />
    );
  }

  renderInlineWheelchairAccessibilityEditor(feature: WheelmapFeature, category: null | undefined | Category, sources: null | undefined | SourceWithLicense[]) {
    const wheelchairAccessibility = feature.properties ? isWheelchairAccessible(feature.properties) : "unknown";

    if (wheelchairAccessibility !== "unknown") {
      return null;
    }

    // if (feature.properties)

    const primarySource = sources && sources.length > 0 ? sources[0].source : undefined;
    // translator: Shown as header/title when you edit wheelchair accessibility of a place
    const header = t`How wheelchair accessible is this place?`;

    const categoryName = categoryNameFor(category);

    return (
      <AppContextConsumer>
        {(appContext) => {
          if (!isA11yEditable(feature, appContext.app, primarySource)) {
            return null;
          }

          return (
            <section>
              <h4 id="wheelchair-accessibility-header">{header}</h4>
              <InlineWheelchairAccessibilityEditor category={categoryName} onChange={this.props.onSelectWheelchairAccessibility} />
            </section>
          );
        }}
      </AppContextConsumer>
    );
  }

  renderChildPlace(feature: Feature) {
    const { category, parentCategory } = Categories.getCategoriesForFeature(this.props.categories, feature);

    return (
      <RouteConsumer>
        {(context) => {
          let params = { ...context.params, id: getFeatureId(feature) };
          return (
            <Link to={"placeDetail"} params={params} className="link-button" style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: "0.125rem 0.75rem", margin: "0.25rem -0.25rem", fontSize: "1rem" }}>
              <CategoryIcon size="small" accessibility={isWheelchairAccessible(feature.properties)} category={String(feature.properties.category)} />
              <span>{translatedStringFromObject(feature.properties.name) || categoryNameFor(category || parentCategory)}</span>
            </Link>
          );
        }}
      </RouteConsumer>
    );
  }

  renderChildPlaces() {
    const { featureId, childPlaceInfos } = this.props;
    if (!featureId || !childPlaceInfos || childPlaceInfos.length === 0) {
      return;
    }
    const sortedFeatures = sortBy(childPlaceInfos, (feature) => {
      if (!feature.properties) {
        return getFeatureId(feature);
      }
      const { category, parentCategory } = Categories.getCategoriesForFeature(this.props.categories, feature);

      const placeInfoName = placeNameFor(feature.properties as any, category || parentCategory);
      return placeInfoName;
    });

    return (
      <StyledIconButtonList style={{ listStyleType: "none", margin: 0, padding: 0 }}>
        {sortedFeatures.map((feature) => (
          <li key={getFeatureId(feature)}>{this.renderChildPlace(feature)}</li>
        ))}
      </StyledIconButtonList>
    );
  }

  renderEquipmentInfos() {
    const { featureId, equipmentInfoId, onEquipmentSelected } = this.props;
    if (!featureId) {
      return;
    }
    const isWheelmapFeature = isWheelmapFeatureId(featureId);
    if (isWheelmapFeature) {
      return;
    }

    const equipmentInfoSet = equipmentInfoCache.getIndexedFeatures("properties.placeInfoId", featureId);
    if (!equipmentInfoSet) {
      return;
    }

    const equipmentInfos = Array.from(equipmentInfoSet);

    if (equipmentInfos.length === 1) {
      return null;
    }

    const equipmentInfosById = fromPairs(equipmentInfos.map((equipmentInfo) => [get(equipmentInfo, "properties._id") || get(equipmentInfo, "_id"), equipmentInfo])) as Dictionary<EquipmentInfo>;

    return <EquipmentOverview placeInfoId={String(featureId)} equipmentInfosById={equipmentInfosById} equipmentInfoId={equipmentInfoId} onEquipmentSelected={onEquipmentSelected} />;
  }

  renderContentBelowHeader() {
    const { accessibilityPresetStatus, equipmentInfo, equipmentInfoId, feature, featureId, onOpenReportMode, category, sources } = this.props;

    const isEquipment = !!equipmentInfoId;

    if (featureId && !isEquipment) {
      switch (this.props.modalNodeState) {
        case "edit-wheelchair-accessibility":
          return this.renderWheelchairAccessibilityEditor();
        case "edit-toilet-accessibility":
          return this.renderToiletAccessibilityEditor();
        case "report":
          return this.renderReportDialog();
        default:
          break;
      }
    }

    if (!featureId) return;

    const sourceLinkProps = {
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      sources,
    };

    const childPlaceInfos = this.renderChildPlaces();
    const accessibilitySection = isEquipment ? (
      <EquipmentAccessibility equipmentInfo={equipmentInfo} />
    ) : (
      <PlaceAccessibilitySection presetStatus={accessibilityPresetStatus} isWheelmapFeature={isWheelmapFeatureId(featureId)} {...this.props}>
        {this.props.childPlaceInfos?.length > 0 && <h2 style={{ fontSize: "1rem", margin: "0 0 0.25rem 0" }}>{t`Places`}</h2>}
        {childPlaceInfos}
      </PlaceAccessibilitySection>
    );

    const wheelmapFeature = wheelmapFeatureFrom(feature);
    const inlineWheelchairAccessibilityEditor = wheelmapFeature ? this.renderInlineWheelchairAccessibilityEditor(wheelmapFeature, category, sources) : null;
    const photoSection = this.renderPhotoSection();
    const equipmentOverview = this.renderEquipmentInfos();

    return (
      <div>
        {isEquipment && featureId && this.renderPlaceNameForEquipment()}
        {inlineWheelchairAccessibilityEditor}
        {accessibilitySection}
        <ConfigurableExternalLinks feature={this.props.feature} joinedMappingEvent={this.props.joinedMappingEvent} />
        {photoSection}
        {equipmentOverview}
        {this.renderIconButtonList()}
        <SourceList {...sourceLinkProps} />
      </div>
    );
  }

  renderCloseLink() {
    const { onClose } = this.props;
    return <PositionedCloseLink {...{ onClick: onClose }} />;
  }

  handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "e" && (event.metaKey || event.ctrlKey) && event.shiftKey) {
      const feature = accessibilityCloudFeatureFrom(this.props.feature);
      if (!feature) {
        return;
      }
      const { properties } = feature;
      const { organizationId, surveyProjectId, surveyResultId } = properties;
      window.open(`https://wheelmap.pro/organizations/${organizationId}/survey-projects/${surveyProjectId}/show?surveyResultId=${surveyResultId}`);
    }
  };

  render() {
    return (
      <FocusTrap
        // hacky way to prevent focus trap from activating when we are in report mode
        active={this.props.modalNodeState !== "report"}
        // We need to set clickOutsideDeactivates here as we want clicks on e.g. the map markers to not be prevented.
        focusTrapOptions={{ clickOutsideDeactivates: true }}
      >
        <div>
          <StyledToolbar ref={this.toolbar} hidden={this.props.hidden} isModal={this.props.modalNodeState !== null} role="dialog" ariaLabel={this.placeName()} minimalTopPosition={this.props.minimalTopPosition} minimalHeight={135} closeOnEscape={this.state.shouldCloseOnEscape} onKeyDown={this.handleKeyDown}>
            <ErrorBoundary>
              {this.renderNodeHeader()}
              {this.renderContentBelowHeader()}
            </ErrorBoundary>
          </StyledToolbar>
        </div>
      </FocusTrap>
    );
  }
}

export default NodeToolbar;
