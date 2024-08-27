import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { useCurrentApp } from '../../../lib/context/AppContext';
import { fetchAccessibilityCloudCategories } from '../../../lib/fetchers/fetchAccessibilityCloudCategories';
import { fetchOnePlaceInfo } from '../../../lib/fetchers/fetchOnePlaceInfo';
import Categories from '../../../lib/model/Categories';
import { placeNameFor } from '../../../lib/model/Feature';
import CloseLink from '../../shared/CloseLink';
import ErrorBoundary from '../../shared/ErrorBoundary';
import NodeHeader from '../NodeHeader';
import PhotoSection from '../Photos/PhotoSection';
import StyledToolbar from '../StyledToolbar';

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';

type Props = {
  placeInfoId?: string;
  // feature?: PlaceInfo;
  // categories?: CategoryLookupTables;
  // category?: Category | null;
  // parentCategory: Category | null;
};

// TODO why is it rendered 3-5+ times?
function PlaceInfoPanel(props: Props) {
  const { placeInfoId } = props;
  console.log(placeInfoId);

  const router = useRouter();
  const app = useCurrentApp();

  // data fetching & handling
  const { data: accessibilityCloudCategories } = useSWR(
    [app.tokenString],
    fetchAccessibilityCloudCategories,
  );
  const { data: feature } = useSWR(
    [app.tokenString, placeInfoId],
    fetchOnePlaceInfo,
  );

  const rawCategories = React.useMemo(
    () => accessibilityCloudCategories && {
      accessibilityCloud: accessibilityCloudCategories.results,
    },
    [accessibilityCloudCategories],
  );

  const lookupTables = React.useMemo(
    () => rawCategories && Categories.generateLookupTables(rawCategories),
    [rawCategories],
  );

  const categories = React.useMemo(
    () => lookupTables
      && feature
      && Categories.getCategoriesForFeature(lookupTables, feature),
    [feature, lookupTables],
  );

  const nodeHeader = (
    <NodeHeader
      feature={feature}
      categories={lookupTables}
      category={categories?.category}
      parentCategory={categories?.parentCategory}
      hasIcon
    >
      <Link href="/" legacyBehavior>
        <PositionedCloseLink />
      </Link>
    </NodeHeader>
  );

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
      >
        <ErrorBoundary>
          {nodeHeader}
          <PhotoSection entityType="nodes" entityId={placeInfoId} />
        </ErrorBoundary>
      </StyledToolbar>
    </div>
  );
}

export default PlaceInfoPanel;
