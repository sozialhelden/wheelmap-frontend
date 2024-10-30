import React, { useContext, useState } from 'react'
import { Button } from '@blueprintjs/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { toast } from 'react-toastify'
import { t } from 'ttag'
import { useCurrentLanguageTagStrings } from '../../../lib/context/LanguageTagContext'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { useFeatureLabel } from '../utils/useFeatureLabel'
import { isWheelchairAccessible } from '../../../lib/model/accessibility/isWheelchairAccessible'
import { unknownCategory } from '../../../lib/model/ac/categories/Categories'
import { getFeatureId, YesNoLimitedUnknown } from '../../../lib/model/ac/Feature'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { AccessibilityView } from '../../../pages/[placeType]/[id]/report/send-report-to-ac'
import Icon from '../../shared/Icon'
import { AppStateLink } from '../../App/AppStateLink'
import { BaseEditorProps } from './BaseEditor'
import { StyledReportView } from '../ReportView'
import {
  ChangesetState,
  createChange,
  createChangeset,
  makeChangeRequestToApi,
} from '../../../pages/[placeType]/[id]/[tag]/edit'
import { log } from '../../../lib/util/logger'
import { isOSMFeature } from '../../../lib/model/geo/AnyFeature'
import { getOSMType } from '../../../lib/model/osm/generateOsmUrls'
import useOSMAPI from '../../../lib/fetchers/osm-api/useOSMAPI'

const fetcher = (prefixedId: string) => {
  debugger
  return fetch(
    `https://api.openstreetmap.org/api/0.6/${prefixedId}.json`,
    {
      headers: { Accept: 'application/json' },
    },
  ).then((res) => res.json()).then((data) => data.elements[0])
}

export const WheelchairEditor = ({ feature, onUrlMutationSuccess }: BaseEditorProps) => {
  const languageTags = useCurrentLanguageTagStrings()
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const {
    category,
    categoryTagKeys,
  } = useFeatureLabel({
    feature,
    languageTags,
  })

  const current = isWheelchairAccessible(feature)

  const cat = ((category && category !== unknownCategory) ? category._id : categoryTagKeys[0]) || 'undefined'
  const [editedTagValue, setEditedTagValue] = useState<YesNoLimitedUnknown | undefined>(current)

  // move this to a separate context?
  // TODO: add typing
  const accessToken = (useSession().data as any)?.accessToken

  const { baseUrl } = useOSMAPI({ cached: false })

  const router = useRouter()
  const { ids, id, tagKey } = router.query
  console.log('id: ', id)

  const tagName = typeof tagKey === 'string' ? tagKey : tagKey[0]
  const osmFeature = isOSMFeature(feature) ? feature : undefined
  const osmType = getOSMType(osmFeature)
  const osmId = getFeatureId(osmFeature)
  const currentOSMObjectOnServer = useSWR(osmFeature?._id, fetcher)
  const currentTagsOnServer = currentOSMObjectOnServer.data?.tags

  const [changesetState, setChangesetState] = React.useState<ChangesetState>()
  const [error, setError] = React.useState<Error>()

  const submitNewValue = React.useCallback(() => {
    if (!currentTagsOnServer || !accessToken || !editedTagValue || !osmType) {
      debugger
      throw new Error('Some information was missing while saving to OpenStreetMap. Please let us know if the error persists.')
    }

    createChangeset({
      baseUrl, accessToken, tagName, newValue: editedTagValue,
    })
      .then((changesetId) => {
        setChangesetState('creatingChange')
        return createChange({
          baseUrl,
          accessToken,
          osmType,
          osmId: id,
          changesetId,
          tagName,
          newTagValue: editedTagValue,
          currentTagsOnServer,
        }).then(() => setChangesetState('changesetComplete'))
      })
      .catch((err) => {
        log.error(err)
        setChangesetState('error')
        setError(err)
      })
  }, [baseUrl, currentTagsOnServer, accessToken, editedTagValue, tagName, id, osmType])

  const handleSuccess = React.useCallback(() => {
    toast.success(
      t`Thank you for contributing. Your edit will be visible soon.`,
    )
    const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), '')
    router.push(newPath)
  }, [router, tagName])

  const onClickHandler = async () => {
    if (accessToken) {
      await submitNewValue()
      handleSuccess()
      return
    }
    if (!editedTagValue || !osmId) {
      // debugger
      throw new Error('Some information was missing while saving to OpenStreetMap. Please let us know if the error persists.')
    }
    await makeChangeRequestToApi(
      {
        baseUrl,
        osmId,
        tagName,
        newTagValue: editedTagValue,
      },
    )
    handleSuccess()
  }

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">How wheelchair accessible is this place?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue('yes')
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={editedTagValue === 'yes'}
          icon={<Icon size="medium" accessibility="yes" category={cat} />}
          valueName="Fully"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue('limited')
          }}
          className="_okay"
          inputLabel="accessibility-partially"
          selected={editedTagValue === 'limited'}
          icon={<Icon size="medium" accessibility="limited" category={cat} />}
          valueName="Partially"
        >
          Entrance has one step with max. 3 inches height, most rooms are without steps
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setEditedTagValue('no')
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={editedTagValue === 'no'}
          icon={<Icon size="medium" accessibility="no" category={cat} />}
          valueName="Not at all"
        >
          Entrance has a high step or several steps, none of the rooms are accessible.
        </AccessibilityView>
      </form>

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}><div role="button" className="_option _back">Back</div></AppStateLink>
        <Button onClick={onClickHandler}>Send</Button>
      </footer>
    </StyledReportView>
  )
}
