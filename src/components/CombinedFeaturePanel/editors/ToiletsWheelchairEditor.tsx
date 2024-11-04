import React, { useContext, useState } from 'react'
import { Button } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { t } from 'ttag'
import { YesNoUnknown } from '../../../lib/model/ac/Feature'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { isOrHasAccessibleToilet } from '../../../lib/model/accessibility/isOrHasAccessibleToilet'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { AccessibilityView } from '../../../pages/[placeType]/[id]/report/send-report-to-ac'
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible'
import { ToiletStatusNotAccessible } from '../../icons/accessibility'
import { AppStateLink } from '../../App/AppStateLink'
import { BaseEditorProps } from './BaseEditor'
import { StyledReportView } from '../ReportView'
import useSubmitNewValue from '../../../lib/fetchers/osm-api/makeChangeRequestToOsmApi'
import { makeChangeRequestToApi } from '../../../lib/fetchers/makeChangeRequestToApi'
import { ChangesetState } from '../../../lib/fetchers/osm-api/ChangesetState'
import retrieveOsmParametersFromFeature from '../../../lib/fetchers/osm-api/retrieveOsmParametersFromFeature'
import { useEnvContext } from '../../../lib/context/EnvContext'
import useOSMAPI from '../../../lib/fetchers/osm-api/useOSMAPI'

export const ToiletsWheelchairEditor = ({ feature }: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const current = isOrHasAccessibleToilet(feature)
  const [editedTagValue, setEditedTagValue] = useState<YesNoUnknown | undefined>(current)

  // TODO: add typing to session data
  const accessToken = (useSession().data as any)?.accessToken
  const router = useRouter()
  const env = useEnvContext()
  const officialOSMAPIBaseUrl = env.NEXT_PUBLIC_OSM_API_BASE_URL
  const { baseUrl } = useOSMAPI({ cached: false })

  const {
    id,
    tagName,
    osmType,
    osmId,
    currentTagsOnServer,
  } = retrieveOsmParametersFromFeature(feature)

  const [changesetState, setChangesetState] = React.useState<ChangesetState>()
  const [error, setError] = React.useState<Error>()

  const {
    submitNewValue,
    callbackChangesetState,
    callbackError,
  } = useSubmitNewValue(accessToken, officialOSMAPIBaseUrl, osmType, osmId, tagName, editedTagValue, currentTagsOnServer)

  const handleSuccess = React.useCallback(() => {
    toast.success(
      t`Thank you for contributing. Your edit will be visible soon.`,
    )
    const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), '')
    router.push(newPath)
  }, [router, tagName])

  const handleClick = async () => {
    if (accessToken) {
      await submitNewValue()
      setChangesetState(callbackChangesetState)
      setError(callbackError)
      handleSuccess()
      return
    }
    if (!editedTagValue || !osmId) {
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
      <h2 className="_title">How wheelchair accessible is the toilet?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue('yes')
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={editedTagValue === 'yes'}
          icon={<ToiletStatusAccessibleIcon />}
          valueName="Yes"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setEditedTagValue('no')
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={editedTagValue === 'no'}
          icon={<ToiletStatusNotAccessible />}
          valueName="No"
        >
          Entrance has a high step or several steps, none of the rooms are accessible.
        </AccessibilityView>
      </form>

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
        <Button onClick={handleClick}>Send</Button>
      </footer>
    </StyledReportView>
  )
}
