import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { fetchAccessibilityCloudCategories } from "../../../lib/fetchers/AccessibilityCloudCategoriesFetcher";
import Layout from "../../App/Layout";
import CloseLink from "../../shared/CloseLink";

import { PlaceInfo } from "@sozialhelden/a11yjson";
import FocusTrap from "focus-trap-react";
import StyledToolbar from "../StyledToolbar";
import ErrorBoundary from "../../shared/ErrorBoundary";
import { placeNameFor } from "../../../lib/model/Feature";
import get from "lodash/get";
import { includes } from "lodash";
import NodeHeader from "../NodeHeader";
import {
  Category,
  CategoryLookupTables,
  getCategoryId,
} from "../../../lib/model/Categories";
import { useCurrentApp } from "../../../lib/context/AppContext";
import { fetchOneAccessibilityCloudFeature } from "../../../lib/fetchers/AccessibilityCloudFeatureFetcher";
import { getData } from "../../../lib/fetchers/fetchWithSWR";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

type Props = {
  placeInfoId?: string | string[];
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
  const [feature, setFeature] = React.useState(undefined);
  const [categories, setCategories] = React.useState(undefined);
  const [category, setCategory] = React.useState(undefined);

  // data fetching & handling
  const cats = getData([app.tokenString], fetchAccessibilityCloudCategories);
  const feat = getData(
    [app.tokenString, placeInfoId],
    fetchOneAccessibilityCloudFeature
  );

  React.useEffect(() => {
    cats && setCategories(cats.results); 
  }, [cats]);

  console.log("Categories",JSON.stringify(categories, null, 2))

  React.useEffect(() => {
    feat && setFeature(feat);
  }, [feat]);

  React.useEffect(() => {
    feature && setCategory(getCategoryId(feature.properties.category));
  }, [feature]);

  // placeInfoId, feature, categories, category


  // rendered comps
  const renderCloseLink = () => {
    const onClose = React.useCallback(() => {
      router.push("/");
    }, []);
    return <PositionedCloseLink {...{ onClick: onClose }} />;
  };

  const renderNodeHeader = () => {
    return (
      <NodeHeader
        feature={feature}
        categories={categories}
        category={category}
        parentCategory={null}
        hasIcon={true}
      >
        {renderCloseLink()}
      </NodeHeader>
    );
  };

  function placeName() {
    return placeNameFor(feature?.properties, category);
  }

  const toolbar = React.createRef<HTMLElement>();

  return (
    <FocusTrap
      // We need to set clickOutsideDeactivates here as we want clicks on e.g. the map markers to not be prevented.
      focusTrapOptions={{ clickOutsideDeactivates: true }}
    >
      <div>
        <StyledToolbar
          ref={toolbar}
          role="dialog"
          ariaLabel={placeName()}
          minimalHeight={135}
          closeOnEscape={true}
        >
          <ErrorBoundary>
            {/* {renderNodeHeader()} */}
            {/* {renderContentBelowHeader()} */}
            {renderCloseLink()}
          </ErrorBoundary>
        </StyledToolbar>
      </div>
    </FocusTrap>

    // <div>
    //   <NodeHeader />
    // </div>
  );
};

export default PlaceInfoPanel;
