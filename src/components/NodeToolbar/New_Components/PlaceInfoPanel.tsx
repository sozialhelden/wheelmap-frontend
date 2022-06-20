import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import {
  getAccessibilityCLoudCategoriesAPIURL,
  getAccessibilityCloudCategoriesFetcher,
} from "../../../lib/fetchers/AccessibilityCloudCategoriesFetcher";
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
import { Category, CategoryLookupTables } from "../../../lib/model/Categories";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

type Props = {
  placeInfoId?: string | string[];
  feature?: PlaceInfo;
  categories?: CategoryLookupTables;
  category?: Category | null;
  parentCategory: Category | null;
};

const PlaceInfoPanel = (props: Props) => {
  const { placeInfoId, feature, categories, category } = props;
  console.log(placeInfoId);

  const router = useRouter();

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
    return placeNameFor(get(feature, "feature.properties"), category);
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
