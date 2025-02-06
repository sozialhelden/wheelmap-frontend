import React from 'react'
import { SWRResponse } from 'swr'
import { log } from '../../util/logger'
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

  function escapeXML(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const allTagsAsXML = Object.entries(newTags)
    .map(([key, value]) => `<tag k="${escapeXML(key)}" v="${escapeXML(value)}" />`)
    .join('\n')

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

export default function useSubmitNewValueCallback({
  accessToken, baseUrl, osmType, osmId, tagName, newTagValue, currentOSMObjectOnServer,
  handleSuccess,
  handleOSMSuccessDBError,
  handleError,
}: {
  accessToken: string;
  baseUrl: string;
  osmType: string;
  osmId: number;
  tagName: string;
  newTagValue: string;
  currentOSMObjectOnServer: SWRResponse<any, any, any>;
  handleSuccess: () => void;
  handleOSMSuccessDBError: (error: Error) => void;
  handleError: (error: Error) => void;
}) {
  const { baseUrl: inhouseBaseUrl } = useOSMAPI({ cached: false })

  return React.useCallback(async () => {
    if (!currentOSMObjectOnServer || !accessToken || !newTagValue || !osmType) {
      throw new Error('Some information was missing while saving to OpenStreetMap. Please let us know if the error persists.')
    }

    let changesetComplete: boolean = false

    try {
      const changesetId = await createChangeset({
        baseUrl, accessToken, tagName, newValue: newTagValue,
      })

      console.log('changeset id: ', changesetId)

      await createChange({
        baseUrl,
        accessToken,
        osmType,
        osmId,
        changesetId,
        tagName,
        newTagValue,
        currentOsmObjectOnServer: currentOSMObjectOnServer,
      })

      changesetComplete = true

      await callBackendToUpdateInhouseDb({
        baseUrl: inhouseBaseUrl, osmType, osmId, tagName
      })

      handleSuccess()
    } catch (error) {
      if (changesetComplete) {
        handleOSMSuccessDBError(error)
      } else {
        handleError(error)
      }
    }
  }, [
    inhouseBaseUrl,
    baseUrl,
    currentOSMObjectOnServer,
    accessToken,
    newTagValue,
    tagName,
    osmId,
    osmType,
    handleError,
    handleOSMSuccessDBError,
    handleSuccess,
  ])
}
