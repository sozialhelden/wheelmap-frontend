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
import { useSession } from "next-auth/react";

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = "PositionedCloseLink";

const baseUrl = process.env.REACT_APP_OSM_API_BASE_URL;

async function createChangeset({ tagName, newValue, accessToken }: { tagName: string; newValue: string; accessToken: string}): Promise<string> {
  const response = await fetch(`${baseUrl}/api/0.6/changeset/create`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/xml",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: `<osm>
      <changeset>
        <tag k="created_by" v="https://wheelmap.org" />
        <tag k="comment" v="Change ${tagName} tag to '${newValue}'" />
      </changeset>
    </osm>`,
  })
  return await response.text();
}

async function createChange({ accessToken, osmType, osmId, changesetId, tagName, newTagValue, currentTagsOnServer }: { accessToken: string; osmType: string; osmId: string | string[]; changesetId: string; tagName: string; newTagValue: any; currentTagsOnServer: any; }) {
  console.log('createChange', osmType, osmId, changesetId, tagName, newTagValue, currentTagsOnServer)
  debugger
  const newTags = {
    ...currentTagsOnServer,
    [tagName]: newTagValue,
  };
  const allTagsAsXML = Object.entries(newTags).map(([key, value]) => {
    return `<tag k="${key}" v="${value}" />`;
  }).join('\n');

  console.log('allTagsAsXML', allTagsAsXML);
  // return fetch(`${baseUrl}/api/0.6/${osmType}/${osmId}`, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "text/xml",
  //     "Authorization": `Bearer ${accessToken}`,
  //   },
  //   body: `<osm>
  //     <${osmType} id="${osmId}" changeset="${changesetId}">

  //     </${osmType}>
  //   </osm>`,
  // }).then((res) => res.text()).then((data) => {
  //   console.log(data);
  // });
}

const fetcher = (type: string, id: number) => {
  if (!type || !id) {
    return null;
  }
  return fetch(
    `https://api.openstreetmap.org/api/0.6/${type}/${id}.json`,
    {
      headers: { Accept: 'application/json' },
    }
  ).then((res) => res.json()).then((data) => data.elements[0]);
}

type ChangesetState = 'creatingChangeset' | 'creatingChange' | 'error' | 'changesetComplete';

export default function CompositeFeaturesPage() {
  const router = useRouter();
  const { ids, id, tag } = router.query;
  const tagName = typeof tag === 'string' ? tag : tag[0];
  const app = useCurrentApp();
  const accessToken = (useSession().data as any)?.accessToken;
  const features = useSWR([app.tokenString, ids], fetchMultipleFeatures);
  const feature = features.data?.find((f) => isOSMFeature(f) && f._id === id);
  const osmFeature = isOSMFeature(feature) ? feature : null;
  const closeEditor = React.useCallback(() => {
    router.push(`/composite/${ids}`);
  }, [router, ids]);
  const [editedTagValue, setEditedTagValue] = React.useState<string | undefined>(feature?.properties[tagName]);
  const osmType = getOSMType(osmFeature);
  const currentOSMObjectOnServer = useSWR([osmType, osmFeature?._id], fetcher);
  const currentTagsOnServer = currentOSMObjectOnServer.data?.tags;
  const currentTagValueOnServer = currentOSMObjectOnServer.data?.tags[tagName];
  React.useEffect(() => {
    setEditedTagValue(currentTagsOnServer?.[tagName]);
  }, [currentTagsOnServer, tagName])

  const featureWithEditedTag = osmFeature ? {
    ...osmFeature,
    properties: {
      ...osmFeature?.properties,
      [tagName]: editedTagValue,
    },
  } : undefined;

  const [changesetState, setChangesetState] = React.useState<ChangesetState>()
  const [error, setError] = React.useState<Error>();

  const submitNewValue = React.useCallback(() => {
    if (!currentTagsOnServer) {
      debugger
      return;
    }
    createChangeset({ accessToken, tagName, newValue: editedTagValue })
      .then((changesetId) => {
        setChangesetState('creatingChange');
        debugger
        return createChange({ accessToken, osmType, osmId: id, changesetId, tagName, newTagValue: editedTagValue, currentTagsOnServer }).then(() => setChangesetState('changesetComplete'));
      })
      .catch((err) => {
        console.error(err);
        setChangesetState('error');
        setError(err);
      });
  }, [editedTagValue, tag, tagName, id, osmType, JSON.stringify(currentTagsOnServer)]);

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
          {/* <FeatureNameHeader feature={featureWithEditedTag || osmFeature} /> */}
          {featureWithEditedTag && <OSMTagEditor feature={featureWithEditedTag} tag={tagName} onChange={setEditedTagValue} onSubmit={submitNewValue} />}
          <p>
            State: {changesetState}
          </p>
          <p>
            Error: {JSON.stringify(error)}
          </p>
          <p>
          currentTagsOnServer: {JSON.stringify(currentTagsOnServer)}
          </p>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
}

CompositeFeaturesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
