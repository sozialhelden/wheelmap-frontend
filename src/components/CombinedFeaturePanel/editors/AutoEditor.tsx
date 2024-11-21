import { t } from 'ttag'
import React, { useContext, useEffect, useState } from 'react'
import { mutate } from 'swr'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { BaseEditorProps } from './BaseEditor'
import { WheelchairEditor } from './WheelchairEditor'
import { ToiletsWheelchairEditor } from './ToiletsWheelchairEditor'
import { StringFieldEditor } from './StringFieldEditor'
import { AppStateLink } from '../../App/AppStateLink'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { StyledReportView } from '../ReportView'
import { makeChangeRequestToApi } from '../../../lib/fetchers/makeChangeRequestToApi'
import useSubmitNewValue from '../../../lib/fetchers/osm-api/makeChangeRequestToOsmApi'
import { useEnvContext } from '../../../lib/context/EnvContext'
import useOSMAPI from '../../../lib/fetchers/osm-api/useOSMAPI'
import retrieveOsmParametersFromFeature from '../../../lib/fetchers/osm-api/retrieveOsmParametersFromFeature'
import { ChangesetState } from '../../../lib/fetchers/osm-api/ChangesetState'
import { EditorTagValue } from './EditorTagValue'

type AutoEditorProps = Omit<BaseEditorProps, 'onUrlMutationSuccess' | 'setParentState' | 'handleSubmitButtonClick'>

const EditorMapping: Record<string, React.FC<BaseEditorProps> | undefined> = {
  wheelchair: WheelchairEditor,
  'toilets:wheelchair': ToiletsWheelchairEditor,
  'wheelchair:description': StringFieldEditor,
}

export const AutoEditor = ({
  feature, tagKey,
}: AutoEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
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
    currentOSMObjectOnServer,
  } = retrieveOsmParametersFromFeature(feature)
  /* console.log('osmId: ', osmId)
  console.log('id: ', id)
  console.log('tagName: ', tagName)
  console.log('tagKey: ', tagKey)
  console.log('osmType: ', osmType)
  console.log('base url: ', baseUrl) */

  const [editedTagValue, setEditedTagValue] = useState<EditorTagValue>('')

  const {
    submitNewValue,
    callbackChangesetState,
    callbackError,
  } = useSubmitNewValue(accessToken, officialOSMAPIBaseUrl, osmType, osmId, tagName, editedTagValue, currentOSMObjectOnServer)

  const handleSuccess = React.useCallback(() => {
    toast.success(
      t`Thank you for contributing. Your edit will be visible soon.`,
    )
    const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), '')
    router.push(newPath)
  }, [router, tagName])

  const handleOSMSuccessDBError = React.useCallback(() => {
    const message = [t`Thank you for contributing.`,
                     t` There was an error while trying to save your changes to our database.`,
                     t` Your changes will still be visible on Open Street Map.`,
    ]
    toast.success(message)
    const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), '')
    router.push(newPath)
  }, [router, tagName])

  const handleError = React.useCallback(() => {
    const message = [
      t`Your contribution could not be saved completely.`,
      t`Please try again later or let us know if the error persists. Error: ${callbackError}`,
    ].join(' ')

    toast.error(message)
  }, [callbackError])

  useEffect(() => {
    if (callbackChangesetState === 'inhouseDBSynced') {
      handleSuccess();
    } else if(callbackChangesetState === 'changesetComplete') {
      handleOSMSuccessDBError();
    } else if(callbackChangesetState === 'creatingChange' 
      || callbackChangesetState === 'creatingChangeset' 
      || callbackChangesetState === 'error' ){ 
      console.log("state: ", callbackChangesetState)
      handleError()
    }
  }, [callbackChangesetState, handleSuccess, handleOSMSuccessDBError, handleError])

  const handleSubmitButtonClick = async () => {
    if (accessToken) {
      await submitNewValue()
      //handleSuccess()
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

  const onUrlMutationSuccess = React.useCallback((urls: string[]) => {
    mutate((key: string) => urls.includes(key), undefined, { revalidate: true })
  }, [])

  const Editor = EditorMapping[tagKey]
  if (Editor) {
    return (
      <Editor
        feature={feature}
        tagKey={tagKey}
        setParentState={setEditedTagValue}
        onUrlMutationSuccess={onUrlMutationSuccess}
        handleSubmitButtonClick={handleSubmitButtonClick}
      />
    )
  }

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">{t`No editor available for ${tagKey}`}</h2>
      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
      </footer>
    </StyledReportView>
  )
}
