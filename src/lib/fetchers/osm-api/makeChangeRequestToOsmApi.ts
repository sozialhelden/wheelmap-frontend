import React from 'react'
import { log } from '../../util/logger'
import { ChangesetState } from './ChangesetState'
import { callBackendToUpdateInhouseDb } from '../callBackendToUpdateInhouseDb'
import useOSMAPI from './useOSMAPI'

export async function createChangeset({
  baseUrl, tagName, newValue, accessToken,
}: {
  baseUrl: string;
  tagName: string;
  newValue: string;
  accessToken: string
}): Promise<string> {
  // Comments cannot be longer than 255 chars
  const truncatedNewValue = newValue.substring(0, 100)
  const response = await fetch(`${baseUrl}/api/0.6/changeset/create`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8',
      Authorization: `Bearer ${accessToken}`,
    },

    body: `<osm>
      <changeset>
        <tag k="created_by" v="https://wheelmap.org" />
        <tag k="comment" v="Change ${tagName} tag to '${truncatedNewValue}'" />
      </changeset>
    </osm>`,
  })
  return response.text()
}

export async function createChange({
  accessToken,
  baseUrl,
  osmType,
  osmId,
  changesetId,
  tagName,
  newTagValue,
  currentOsmObjectOnServer,
}: {
  baseUrl: string;
  accessToken: string;
  osmType: string;
  // osmId: string | string[];
  osmId: string; // i dont think there can be an array of ids in the change request
  changesetId: string;
  tagName: string;
  newTagValue: any;
  currentOsmObjectOnServer: any;
}) {
  log.log('createChange', osmType, osmId, changesetId, tagName, newTagValue, currentOsmObjectOnServer.data)
  const {
    version, lat, lon, id, tags,
  } = currentOsmObjectOnServer.data
  const numericId = id
  const currentTagsOnServer = tags
  const newTags = {
    ...currentTagsOnServer,
    [tagName]: newTagValue,
  }
  const allTagsAsXML = Object.entries(newTags).map(([key, value]) => `<tag k="${key}" v="${value}" />`).join('\n')

  log.log('allTagsAsXML', allTagsAsXML)

  let body

  if (osmType === 'node') {
    body = `<osm>
      <${osmType} id="${numericId}" changeset="${changesetId}" lat="${lat}" lon="${lon}" version="${version}">
        ${allTagsAsXML}
      </${osmType}>
    </osm>`
  } else {
    // for way and relation exclude lat and lon
    body = `<osm>
      <${osmType} id="${numericId}" changeset="${changesetId}" version="${version}">
        ${allTagsAsXML}
      </${osmType}>
    </osm>`
  }
  return fetch(`${baseUrl}/api/0.6/${osmId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/xml',
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  }).then((res) => res.text()).then((data) => {
    log.log(data)
  })
}

export default function useSubmitNewValue(accessToken, baseUrl, osmType, osmId, tagName, newTagValue, currentOsmObjectOnServer) {
  const [callbackChangesetState, setCallbackChangesetState] = React.useState<ChangesetState>()
  const [callbackError, setCallbackError] = React.useState<Error>()
  const { baseUrl: inhouseBaseUrl } = useOSMAPI({ cached: false })

  const submitNewValue = React.useCallback(() => {
    if (!currentOsmObjectOnServer || !accessToken || !newTagValue || !osmType) {
      throw new Error('Some information was missing while saving to OpenStreetMap. Please let us know if the error persists.')
    }

    createChangeset({
      baseUrl, accessToken, tagName, newValue: newTagValue,
    })
      .then((changesetId) => {
        console.log('changeset id: ', changesetId)
        setCallbackChangesetState('creatingChange')
        return createChange({
          baseUrl,
          accessToken,
          osmType,
          osmId,
          changesetId,
          tagName,
          newTagValue,
          currentOsmObjectOnServer,
        }).then(() => {
          setCallbackChangesetState('changesetComplete')
          return callBackendToUpdateInhouseDb({
            baseUrl: inhouseBaseUrl, osmType, osmId,
          })
        })
      })
      .catch((err) => {
        log.error(err)
        setCallbackChangesetState('error')
        setCallbackError(err)
      })
  }, [inhouseBaseUrl, baseUrl, currentOsmObjectOnServer, accessToken, newTagValue, tagName, osmId, osmType])

  /* const handleSuccess = React.useCallback(() => {
            toast.success(
              t`Thank you for contributing. Your edit will be visible soon.`,
            )
            const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), '')
            router.push(newPath)
          }, [router, tagName]) */

  return {
    submitNewValue, callbackChangesetState, callbackError,
  }
}
