import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { fetchAccessibilityCloudCategories } from "../../../lib/fetchers/AccessibilityCloudCategoriesFetcher";
import Layout from "../../App/Layout";
import CloseLink from "../../shared/CloseLink";
import { ModalNodeState } from '../../../lib/ModalNodeState' ;
import { PlaceInfo } from "@sozialhelden/a11yjson";
import FocusTrap from "focus-trap-react";
import StyledToolbar from "../StyledToolbar";
import ErrorBoundary from "../../shared/ErrorBoundary";
import { placeNameFor } from "../../../lib/model/Feature";
import get from "lodash/get";
import { includes } from "lodash";
import NodeHeader from "../NodeHeader";
import Categories, {
  Category,
  CategoryLookupTables,
  getCategoryId,
  RawCategoryLists,
} from "../../../lib/model/Categories";
import { useCurrentApp } from "../../../lib/context/AppContext";
import { fetchOneAccessibilityCloudFeature } from "../../../lib/fetchers/AccessibilityCloudFeatureFetcher";
import { getData } from "../../../lib/fetchers/fetchWithSWR";
import PhotoSection from "../Photos/PhotoSection";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

type Props = {
  placeInfoId?: string;
  // feature?: PlaceInfo;
  // categories?: CategoryLookupTables;
  // category?: Category | null;
  // parentCategory: Category | null;
};

// TODO why is it rendered 3-5+ times?
const PlaceInfoPanel = (props: Props) => {
  const {
    placeInfoId,
    // feature,
    // categories,
    // category
  } = props;
  console.log(placeInfoId);

  const router = useRouter();
  const app = useCurrentApp();

  // data fetching & handling
  const { data: accessibilityCloudCategories } = useSWR([app.tokenString], fetchAccessibilityCloudCategories);
  const { data: feature } = useSWR([app.tokenString, placeInfoId], fetchOneAccessibilityCloudFeature);

  const rawCategories = React.useMemo(() => (accessibilityCloudCategories && { "accessibilityCloud" : accessibilityCloudCategories.results }), [accessibilityCloudCategories]);

  const lookupTables = React.useMemo(() =>
    rawCategories && Categories.generateLookupTables(rawCategories),
    [rawCategories]
  );

  const categories = React.useMemo(() =>
    lookupTables && feature && Categories.getCategoriesForFeature(lookupTables, feature)
  , [feature, lookupTables]);

  // placeInfoId, feature, categories, category

  const modalNodeState: ModalNodeState = 'edit-wheelchair-accessibility'; // TODO remove mock
  const statesWithIcon = ['edit-toilet-accessibility', 'report'];
  const isModalStateWithPlaceIcon = includes(statesWithIcon, modalNodeState);
  const hasIcon = !!modalNodeState || isModalStateWithPlaceIcon;

  const nodeHeader =
    <NodeHeader
      feature={feature}
      categories={lookupTables}
      category={categories?.category}
      parentCategory={categories?.parentCategory}
      hasIcon={hasIcon}
    >
      <Link href="/">
        <PositionedCloseLink />
      </Link>
    </NodeHeader>;

  const placeName = placeNameFor(feature?.properties, categories?.category);

  const toolbar = React.createRef<HTMLElement>();

  return (
        <div>
          <StyledToolbar
            ref={toolbar}
            role="dialog"
            ariaLabel={placeName}
            minimalHeight={135}
            minimalTopPosition={60} // TODO replace magic number
            closeOnEscape={true}
            >
            <ErrorBoundary>
              {nodeHeader}
              <PhotoSection entityType={"nodes"} entityId={placeInfoId} />
              {/* {renderContentBelowHeader()} */}
            </ErrorBoundary>
          </StyledToolbar>
        </div>
  );
};

export default PlaceInfoPanel;
