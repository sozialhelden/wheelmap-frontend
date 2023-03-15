import { Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { t } from "ttag";
import Layout from "../../../../../components/App/Layout";
import { CombinedFeaturePanel } from "../../../../../components/CombinedFeaturePanel/CombinedFeaturePanel";
import FeatureNameHeader from "../../../../../components/CombinedFeaturePanel/components/FeatureNameHeader";
import CloseLink from "../../../../../components/shared/CloseLink";
import Toolbar from "../../../../../components/shared/Toolbar";
import { useCurrentApp } from "../../../../../lib/context/AppContext";
import { fetchMultipleFeatures } from "../../../../../lib/fetchers/fetchMultipleFeatures";
import { isOSMFeature } from "../../../../../lib/model/shared/AnyFeature";
import { OSMTagEditor } from "../../../../../components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagEditor";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

export default function CompositeFeaturesPage() {
  const router = useRouter();
  const { ids, id, tag } = router.query;
  const tagString = typeof tag === 'string' ? tag : tag[0];
  const app = useCurrentApp();
  const features = useSWR([app.tokenString, ids], fetchMultipleFeatures);
  const feature = features.data?.find((f) => isOSMFeature(f) && f._id === id);
  const osmFeature = isOSMFeature(feature) ? feature : null;
  const currentTagValue = feature?.properties?.[tagString];
  const [value, setValue] = React.useState(currentTagValue);
  const closeEditor = React.useCallback(() => {
    router.push(`/composite/${ids}`);
  }, [router, ids]);

  const featureWithEditedTag = osmFeature ? {
    ...osmFeature,
    properties: {
      ...osmFeature?.properties,
      [tagString]: value,
    },
  } : feature;

  return (
    <>
      <Toolbar>
        <CombinedFeaturePanel features={features.data || []} />
      </Toolbar>

      <Dialog
        isOpen={true}
        isCloseButtonShown={true}
        canEscapeKeyClose={true}
        enforceFocus={true}
        shouldReturnFocusOnClose={true}
        onClose={closeEditor}
        usePortal={true}
        title={t`Edit ${tag} tag`}
      >
        <DialogBody>
          <FeatureNameHeader feature={featureWithEditedTag} />
          <OSMTagEditor feature={featureWithEditedTag} tag={tagString} onValueChange={setValue} />
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
