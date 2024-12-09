import { Dialog, DialogBody, DialogFooter } from '@blueprintjs/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { t } from 'ttag'
import { getLayout } from '../../../../components/CombinedFeaturePanel/PlaceLayout'

import { toast } from 'react-toastify'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { CombinedFeaturePanel } from '../../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import { OSMTagEditor } from '../../../../components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagEditor'
import { useEnvContext } from '../../../../lib/context/EnvContext'
import { getOSMType } from '../../../../lib/model/osm/generateOsmUrls'
import { isOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import Toolbar from '../../../../components/shared/Toolbar'
import useSubmitNewValueCallback from '../../../../lib/fetchers/osm-api/makeChangeRequestToOsmApi'
import { fetchFeatureSplitId } from '../../../../lib/fetchers/osm-api/fetchFeatureSplitId'
import { ChangesetState } from '../../../../lib/fetchers/osm-api/ChangesetState'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

export default function CompositeFeaturesPage() {
  const router = useRouter()
  const env = useEnvContext()
  const officialOSMAPIBaseUrl = env.NEXT_PUBLIC_OSM_API_URL
  const { ids, id, tag } = router.query
  const tagName = typeof tag === 'string' ? tag : tag[0]
  const accessToken = (useSession().data as any)?.accessToken
  const featureStringIds = typeof ids === 'string' ? [ids] : ids
  const featureIds = featureStringIds.map((x) => {
    if (isOSMId(x)) {
      return normalizeOSMId(x)
    }
    if (isAccessibilityCloudId(x)) {
      return x
    }
    return undefined
  })
  const features = useFeatures(featureIds)
  const feature = features.data?.find((f) => isOSMFeature(f) && f._id === id)
  const osmFeature = isOSMFeature(feature) ? feature : null
  const closeEditor = React.useCallback(() => {
    router.push(`/composite/${ids}`, undefined, { shallow: true })
  }, [router, ids])
  const [editedTagValue, setEditedTagValue] = React.useState<string | undefined>(feature?.properties[tagName])
  const osmType = getOSMType(osmFeature)
  const currentOSMObjectOnServer = useSWR(osmFeature?._id, fetchFeatureSplitId)
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

  const {
    callbackChangesetState,
    callbackError,
    submitNewValue,
  } = useSubmitNewValueCallback({
    accessToken, baseUrl: officialOSMAPIBaseUrl, osmType, osmId: id, tagName, newTagValue: editedTagValue, currentOSMObjectOnServer: currentTagsOnServer,
  })

  useEffect(() => {
    if (callbackError) {
      toast.error(t`An error occurred while saving your changes. Please try again later. Error: ${callbackError}`)
    }
  }, [callbackError])

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
          {featureWithEditedTag
              && (
                <OSMTagEditor
                  feature={featureWithEditedTag}
                  tag={tagName}
                  onChange={setEditedTagValue}
                  onSubmit={submitNewValue}
                />
              )}
          <p>
            State:
            {' '}
            {callbackChangesetState}
          </p>
          <p>
            Error:
            {' '}
            {JSON.stringify(callbackError)}
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

CompositeFeaturesPage.getLayout = getLayout
