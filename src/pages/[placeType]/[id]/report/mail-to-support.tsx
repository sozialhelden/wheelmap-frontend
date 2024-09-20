import React, { FC, useContext } from 'react'
import { t } from 'ttag'
import { LocalizedString } from '@sozialhelden/a11yjson'
import { StyledReportView } from '.'
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext'
import useUserAgent from '../../../../lib/context/UserAgentContext'
import { useFeatureLabel } from '../../../../components/CombinedFeaturePanel/utils/useFeatureLabel'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { AppStateLink } from '../../../../components/App/AppStateLink'

const reportSubject = (
  placeName: LocalizedString | string | undefined,
  categoryName: string | undefined,
) => {
  if (placeName) {
    // translator: Report email subject if place name is known
    return t`[Wheelmap] Problem with ${placeName} on Wheelmap`
  }
  if (categoryName) {
    // translator: Report email subject if place name is unknown, but place category name (for example ‘toilet’)
    // is known (don't use an indefinite article if it would need to be inflected in the target language)
    return t`[Wheelmap] Problem with a ${categoryName} on Wheelmap`
  }
  // translator: Report email subject if neither place name nor category name is known
  return t`[Wheelmap] Problem with a place on Wheelmap`
}

// translator: Report email body with place URL
const reportBody = (url: string, userAgent: string) => t`(Please only write in English or German.)

Dear Sozialhelden,
something about this place is wrong: ${url}

The problem is:

My browser:\n\n${userAgent}`

const makeEmailUri = (mailAddress: `${string}@${string}`, subject: string, body: string) => `mailto:${mailAddress}`
+ `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

const EmailView: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const userAgent = useUserAgent()

  const languageTags = useCurrentLanguageTagStrings()
  const { placeName, categoryName } = useFeatureLabel({ feature, languageTags })
  const subject = reportSubject(placeName, categoryName)
  const body = reportBody(global?.window?.location.href, userAgent?.ua ?? navigator?.userAgent)

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h1>{t`We're sorry about the inconvenience!`}</h1>
      <p>{t`To help you best, we kindly ask you to send us an email and our support will personally help you.`}</p>
      <footer className="_footer">
        <AppStateLink href="../report"><div role="button" className="_option _back">Back</div></AppStateLink>
        <a
          role="button"
          className="_option _primary"
          href={makeEmailUri('bugs@wheelmap.org', subject, body)}
        >
          Email Us
        </a>

      </footer>
    </StyledReportView>
  )
}

function ReportSupportMail() {
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]

  return <EmailView feature={feature} />
}

ReportSupportMail.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default ReportSupportMail
