import React from 'react'
import { log } from '../../util/logger'
import { ChangesetState } from './ChangesetState'

export async function createChangeset({
  baseUrl, tagName, newValue, accessToken,
}: {
  baseUrl: string;
  tagName: string;
  newValue: string;
  accessToken: string
}): Promise<string> {
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
  accessToken,
  baseUrl,
  osmType,
  osmId,
  changesetId,
  tagName,
  newTagValue,
  currentTagsOnServer,
}: {
  baseUrl: string;
  accessToken: string;
  osmType: string;
  osmId: string | string[];
  changesetId: string;
  tagName: string;
  newTagValue: any;
  currentTagsOnServer: any;
}) {
  log.log('createChange', osmType, osmId, changesetId, tagName, newTagValue, currentTagsOnServer)

  const newTags = {
    ...currentTagsOnServer,
    [tagName]: newTagValue,
  }
  const allTagsAsXML = Object.entries(newTags).map(([key, value]) => `<tag k="${key}" v="${value}" />`).join('\n')

  log.log('allTagsAsXML', allTagsAsXML)
  return fetch(`${baseUrl}/api/0.6/${osmId}`, {
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

export default function useSubmitNewValue(accessToken, baseUrl, osmType, osmId, tagName, newTagValue, currentTagsOnServer) {
  const [callbackChangesetState, setCallbackChangesetState] = React.useState<ChangesetState>()
  const [callbackError, setCallbackError] = React.useState<Error>()

  const submitNewValue = React.useCallback(() => {
    if (!currentTagsOnServer || !accessToken || !newTagValue || !osmType) {
      throw new Error('Some information was missing while saving to OpenStreetMap. Please let us know if the error persists.')
    }

    createChangeset({
      baseUrl, accessToken, tagName, newValue: newTagValue,
    })
      .then((changesetId) => {
        setCallbackChangesetState('creatingChange')
        return createChange({
          baseUrl,
          accessToken,
          osmType,
          osmId,
          changesetId,
          tagName,
          newTagValue,
          currentTagsOnServer,
        }).then(() => setCallbackChangesetState('changesetComplete'))
      })
      .catch((err) => {
        log.error(err)
        setCallbackChangesetState('error')
        setCallbackError(err)
      })
  }, [baseUrl, currentTagsOnServer, accessToken, newTagValue, tagName, osmId, osmType])

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
