/* eslint-disable @stylistic/js/indent */
/* eslint-disable indent */
/* eslint-disable @next/next/no-img-element */
import React, {
  FC, useContext, useRef, useState,
} from 'react'
import { t } from 'ttag'
import { StyledPhotoUploadView } from '../../../../components/CombinedFeaturePanel/PhotoUploadView'
import { CheckmarkIcon } from '../../../../components/icons/actions'
import { useCurrentAppToken } from '../../../../lib/context/AppContext'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { AppStateLink } from '../../../../components/App/AppStateLink'
import uploadPhotoForFeature from '../../../../lib/fetchers/ac/refactor-this/postImageUpload'
import { getLayout } from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { Button } from '@radix-ui/themes'

const uncachedUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''

const ExplanationContent : FC<{ onStateChanged: (state: 'uploading' | 'done' | 'error') => unknown }> = ({
  onStateChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const appToken = useCurrentAppToken()

  const { features } = useContext(FeaturePanelContext)
  const feature = features[0]

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    (async () => {
      if (!evt.target.files) {
        return
      }
      onStateChanged('uploading')
      try {
        await uploadPhotoForFeature(feature, evt.target.files, appToken, uncachedUrl)
      } catch {
        onStateChanged('error')
      }
      onStateChanged('done')
    })()
  }

  return (
    <StyledPhotoUploadView>
      <h1 className="title">{t`The following images...`}</h1>

      <div className="entry">
        <div className="description">
          <CheckmarkIcon className="checkmark" />
          {t`...give useful information on accessibility.`}
        </div>
        <div className="details pictograms">
          <figure className="graphic">
            <img src="/images/photo-upload/entrancePlaceholder.png" alt="A pictogram of an entrance" />
            <figcaption>{t`Entrances`}</figcaption>
          </figure>
          <figure className="graphic">
            <img src="/images/photo-upload/sitemapPlaceholder.png" alt="A topdown view showing navigational information" />
            <figcaption>{t`Site map`}</figcaption>
          </figure>
          <figure className="graphic">
            <img src="/images/photo-upload/toiletPlaceholder.png" alt="A pictogram of a toilet" />
            <figcaption>{t`Toilets`}</figcaption>
          </figure>
        </div>
      </div>

      <div className="entry">
        <div className="description">
          <CheckmarkIcon className="checkmark" />
          {t`...were taken by me`}
        </div>
        <div className="details">
          {t`I hereby publish these images in the public domain and renounce copyright protection `}
          (
          <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">
            {t`CC0 1.0 Universal license`}
          </a>
          ).
        </div>
      </div>

      <div className="entry">
        <div className="description">
          <CheckmarkIcon className="checkmark" />
          {t`...do not show any identifiable persons.`}
        </div>
      </div>

      <div className="actions">
        <AppStateLink href="..">
          <Button className="cancel">{t`Cancel`}</Button>
        </AppStateLink>
        <Button className="accept" onClick={() => { fileInputRef.current?.click() }}>{t`Accept`}</Button>
        <input onChange={handleChange} multiple={false} ref={fileInputRef} type="file" hidden accept="image/jpeg" />
      </div>
    </StyledPhotoUploadView>
  )
}

const UploadingPanel: FC = () => (
  <StyledPhotoUploadView>
    <h1 className="title">{t`Uplading...`}</h1>
    <div className="spinner"><div className="loader" /></div>
  </StyledPhotoUploadView>
)

const SuccessfulPanel: FC = () => (
  <StyledPhotoUploadView>
    <h1 className="title">{t`Thank you`}</h1>
    <div className="entry">
      <div className="description">{t`We're thankful for your contribution and will review your uploaded image shortly!`}</div>
    </div>

    <div className="actions">
      <AppStateLink href="..">
        <Button className="neutral" large minimal>{t`Go Back`}</Button>
      </AppStateLink>
    </div>
  </StyledPhotoUploadView>
)

const ErrorPanel: FC<{ setState: (state: 'idle') => unknown }> = ({ setState }) => (
  <StyledPhotoUploadView>
    <h1 className="title">{t`That did not quite work right!`}</h1>
    <div className="entry">
      <div className="description">
        {t`Something went wrong on our side, we're sorry about the inconvenience. Do you want to try again?`}
      </div>
    </div>
    <div className="actions">
      <AppStateLink href="..">
        <Button className="cancel" large minimal>{t`Cancel`}</Button>
      </AppStateLink>
      <Button className="neutral" large onClick={() => setState('idle')}>{t`Retry`}</Button>
    </div>
  </StyledPhotoUploadView>
)

export default function Page() {
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')

  switch (state) {
    case 'idle':
      return <ExplanationContent onStateChanged={setState} />
    case 'uploading':
      return <UploadingPanel />
    case 'done':
      return <SuccessfulPanel />
    default:
      return <ErrorPanel setState={setState} />
  }
}

Page.getLayout = getLayout
