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
  const [rawCategories, setRawCategories] = React.useState<RawCategoryLists>(undefined);
  const [category, setCategory] = React.useState(undefined);
  const [categoryLookupTables, setLookupTables] = React.useState<CategoryLookupTables>(undefined);

  // data fetching & handling
  const cats = getData([app.tokenString], fetchAccessibilityCloudCategories);
  const feat = getData(
    [app.tokenString, placeInfoId],
    fetchOneAccessibilityCloudFeature
  );

  React.useEffect(() => {
    cats && setRawCategories( { "accessibilityCloud" : cats.results} ); 
  }, [cats]);
  console.log("Categories",JSON.stringify(rawCategories, null, 2))


  React.useEffect(() => {
    const lookupTables = rawCategories && Categories.generateLookupTables(rawCategories);
    setLookupTables(lookupTables);
  }, [rawCategories]);

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
    
    const modalNodeState: ModalNodeState = 'edit-wheelchair-accessibility'; // TODO remove mock

    const statesWithIcon = ['edit-toilet-accessibility', 'report'];
    const isModalStateWithPlaceIcon = includes(statesWithIcon, modalNodeState);
    const hasIcon = !!modalNodeState || isModalStateWithPlaceIcon;

    return (
      
      <NodeHeader
        feature={feature}
        categories={categoryLookupTables}
        category={category}
        parentCategory={null}
        hasIcon={hasIcon}
        >
      </NodeHeader>
        
    );
  };

  function placeName() {
    return placeNameFor(feature?.properties, category);
  }

  const toolbar = React.createRef<HTMLElement>();

  return (
        <div>
          <StyledToolbar
            ref={toolbar}
            role="dialog"
            ariaLabel={placeName()}
            minimalHeight={135}
            minimalTopPosition={60} // TODO replace magic number
            closeOnEscape={true}
            >
            <ErrorBoundary>
              {renderNodeHeader()}
              {/* {renderContentBelowHeader()} */}
            </ErrorBoundary>
          </StyledToolbar>
        </div>
  );
};

export default PlaceInfoPanel;
