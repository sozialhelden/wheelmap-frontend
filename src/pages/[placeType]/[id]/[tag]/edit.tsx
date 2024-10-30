import { Dialog, DialogBody, DialogFooter } from '@blueprintjs/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { t } from 'ttag'

import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { CombinedFeaturePanel } from '../../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import { OSMTagEditor } from '../../../../components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagEditor'
import CloseLink from '../../../../components/shared/CloseLink'
import { useEnvContext } from '../../../../lib/context/EnvContext'
import { getOSMType } from '../../../../lib/model/osm/generateOsmUrls'
import { isOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { useMultipleFeatures } from '../../../../lib/fetchers/fetchMultipleFeatures'
import Toolbar from '../../../../components/shared/Toolbar'
import { log } from '../../../../lib/util/logger'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export async function createChangeset({
  baseUrl, tagName, newValue, accessToken,
}: { baseUrl: string; tagName: string; newValue: string; accessToken: string }): Promise<string> {
  const response = await fetch(`${baseUrl}/api/0.6/changeset/create`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/xml',
      Authorization: `Bearer ${accessToken}`,
    },
    body: `<osm>
      <changeset>
        <tag k="created_by" v="https://wheelmap.org" />
        <tag k="comment" v="Change ${tagName} tag to '${newValue}'" />
      </changeset>
    </osm>`,
  })
  return response.text()
}

export async function createChange({
  accessToken, baseUrl, osmType, osmId, changesetId, tagName, newTagValue, currentTagsOnServer,
}: { baseUrl: string; accessToken: string; osmType: string; osmId: string | string[]; changesetId: string; tagName: string; newTagValue: any; currentTagsOnServer: any; }) {
  log.log('createChange', osmType, osmId, changesetId, tagName, newTagValue, currentTagsOnServer)
  debugger
  const newTags = {
    ...currentTagsOnServer,
    [tagName]: newTagValue,
  }
  const allTagsAsXML = Object.entries(newTags).map(([key, value]) => `<tag k="${key}" v="${value}" />`).join('\n')

  log.log('allTagsAsXML', allTagsAsXML)
  return fetch(`${baseUrl}/api/0.6/${osmType}/${osmId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/xml',
      Authorization: `Bearer ${accessToken}`,
    },
    body: `<osm>
      <${osmType} id="${osmId}" changeset="${changesetId}">
        ${allTagsAsXML}
      </${osmType}>
    </osm>`,
  }).then((res) => res.text()).then((data) => {
    log.log(data)
  })
}

/* fetch("https://osm-api.wheelmap.tech/api/v1/legacy/api/node/11226443397/wheelchair", {
    "body": "{ \"value\": \"no\" }",
    "cache": "default",
    "credentials": "omit",
    "headers": {
      "Accept": "*!/!*",
      "Content-Type": "application/json",
    },
    "method": "POST",
    "mode": "cors",
    "redirect": "follow",
    "referrer": "https://wheelmap.org/",
    "referrerPolicy": "strict-origin-when-cross-origin"
  }) */

export async function makeChangeRequestToApi({
  baseUrl,
  osmType,
  osmId,
  tagName,
  newTagValue,
  // currentTagsOnServer,
}: {
  baseUrl: string;
  osmType: string;
  osmId: string;
  tagName: string;
  newTagValue: string;
  // currentTagsOnServer: any;
}) {
  log.log('makeChangeRequestToApi', osmType, osmId, tagName, newTagValue)
  return fetch(`${baseUrl}/api/v1/legacy/api/${osmType}/${osmId}/${tagName}`, {
    body: JSON.stringify({ value: newTagValue }),
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }).then((res) => res.text()).then((data) => {
    log.log(data)
  })
}

export const fetcher = (type: string, id: number) => {
  if (!type || !id) {
    return null
  }
  return fetch(
    `https://api.openstreetmap.org/api/0.6/${type}/${id}.json`,
    {
      headers: { Accept: 'application/json' },
    },
  ).then((res) => res.json()).then((data) => data.elements[0])
}

export type ChangesetState = 'creatingChangeset' | 'creatingChange' | 'error' | 'changesetComplete'

export default function CompositeFeaturesPage() {
  const router = useRouter()
  const env = useEnvContext()
  const officialOSMAPIBaseUrl = env.NEXT_PUBLIC_OSM_API_URL
  const { ids, id, tag } = router.query
  const tagName = typeof tag === 'string' ? tag : tag[0]
  const accessToken = (useSession().data as any)?.accessToken
  const features = useMultipleFeatures(ids)
  const feature = features.data?.find((f) => isOSMFeature(f) && f._id === id)
  const osmFeature = isOSMFeature(feature) ? feature : null
  const closeEditor = React.useCallback(() => {
    router.push(`/composite/${ids}`)
  }, [router, ids])
  const [editedTagValue, setEditedTagValue] = React.useState<string | undefined>(feature?.properties[tagName])
  const osmType = getOSMType(osmFeature)
  const currentOSMObjectOnServer = useSWR([osmType, osmFeature?._id], fetcher)
  const currentTagsOnServer = currentOSMObjectOnServer.data?.tags
  const currentTagValueOnServer = currentOSMObjectOnServer.data?.tags[tagName]
  React.useEffect(() => {
    setEditedTagValue(currentTagsOnServer?.[tagName])
  }, [currentTagsOnServer, tagName])

  const featureWithEditedTag = osmFeature ? {
    ...osmFeature,
    properties: {
      ...osmFeature?.properties,
      [tagName]: editedTagValue,
    },
  } : undefined

  const [changesetState, setChangesetState] = React.useState<ChangesetState>()
  const [error, setError] = React.useState<Error>()

  const submitNewValue = React.useCallback(() => {
    if (!currentTagsOnServer) {
      debugger
      return
    }
    createChangeset({
      baseUrl: officialOSMAPIBaseUrl, accessToken, tagName, newValue: editedTagValue,
    })
      .then((changesetId) => {
        setChangesetState('creatingChange')
        debugger
        return createChange({
          baseUrl: officialOSMAPIBaseUrl, accessToken, osmType, osmId: id, changesetId, tagName, newTagValue: editedTagValue, currentTagsOnServer,
        }).then(() => setChangesetState('changesetComplete'))
      })
      .catch((err) => {
        log.error(err)
        setChangesetState('error')
        setError(err)
      })
  }, [editedTagValue, tag, tagName, id, osmType, JSON.stringify(currentTagsOnServer)])

  return (
    <>
      <Toolbar>
        <CombinedFeaturePanel features={features.data || []} />
      </Toolbar>

      <Dialog
        isOpen
        isCloseButtonShown
        canEscapeKeyClose
        enforceFocus
        shouldReturnFocusOnClose
        onClose={closeEditor}
        usePortal
        title={t`Edit ${tag} tag`}
      >
        <DialogBody>
          {/* <FeatureNameHeader feature={featureWithEditedTag || osmFeature} /> */}
          {featureWithEditedTag && <OSMTagEditor feature={featureWithEditedTag} tag={tagName} onChange={setEditedTagValue} onSubmit={submitNewValue} />}
          <p>
            State:
            {' '}
            {changesetState}
          </p>
          <p>
            Error:
            {' '}
            {JSON.stringify(error)}
          </p>
          <p>
            currentTagsOnServer:
            {' '}
            {JSON.stringify(currentTagsOnServer)}
          </p>
        </DialogBody>
        <DialogFooter />
      </Dialog>
    </>
  )
}

CompositeFeaturesPage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}
