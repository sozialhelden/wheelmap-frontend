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
import { getOSMType } from "../../../../../lib/model/shared/generateOsmUrls";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

const baseUrl = process.env.REACT_APP_OSM_API_BASE_URL;

async function createChangeset() {
  const response = await fetch(`${baseUrl}/api/0.6/changeset/create`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/xml",
    },
    body: `<osm>
      <changeset>
        <tag k="created_by" v="https://wheelmap.org" />
        <tag k="comment" v="Change ${tag} tag" />
      </changeset>
    </osm>`,
  }).then((res) => res.text());
  return response;
}

const fetcher = (type: string, id: number) => fetch(
  `https://api.openstreetmap.org/api/0.6/${type}/${id}.json`,
  {
    headers: { Accept: 'application/json' },
  }
).then((res) => res.json()).then((data) => data.elements[0]);


export default function CompositeFeaturesPage() {
  const router = useRouter();
  const { ids, id, tag } = router.query;
  const tagString = typeof tag === 'string' ? tag : tag[0];
  const app = useCurrentApp();
  const features = useSWR([app.tokenString, ids], fetchMultipleFeatures);
  const feature = features.data?.find((f) => isOSMFeature(f) && f._id === id);
  const osmFeature = isOSMFeature(feature) ? feature : null;
  const closeEditor = React.useCallback(() => {
    router.push(`/composite/${ids}`);
  }, [router, ids]);
  const [editedTag, setEditedTag] = React.useState(feature.properties[tagString]);
  const type = getOSMType(osmFeature);
  const currentOSMObjectOnServer = useSWR([type, osmFeature?._id], fetcher);
  const currentTagValueOnServer = currentOSMObjectOnServer.data?.tags[tagString];
  React.useEffect(() => {
    setEditedTag(currentOSMObjectOnServer.data?.tags[tagString]);
  }, [currentTagValueOnServer])

  const featureWithEditedTag = osmFeature ? {
    ...osmFeature,
    properties: {
      ...osmFeature?.properties,
      [tagString]: editedTag,
    },
  } : undefined;

  const submitNewValue = React.useCallback(() => {
    alert(`Submit value ${editedTag} for tag ${tag} on OSM object ${id} of type ${type}.`);
  }, [editedTag, tag, id, type]);

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
          <FeatureNameHeader feature={featureWithEditedTag || osmFeature} />
          {featureWithEditedTag && <OSMTagEditor feature={featureWithEditedTag} tag={tagString} onChange={setEditedTag} onSubmit={submitNewValue} />}
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
