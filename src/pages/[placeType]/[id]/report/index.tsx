import React, {
  useContext,
} from 'react'
import { t } from 'ttag'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { getLayout } from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { AppStateLink } from '../../../../components/App/AppStateLink'
import { StyledReportView } from '../../../../components/CombinedFeaturePanel/ReportView'

const options = [
  {
    title: t`The place is rated as 'Not wheelchair accessible', but this is wrong!`,
    redirect: './report/wheelchair-accessibility',
  } as const,
  {
    title: t`The accessibility to the toilet here is rated incorrectly or is missing.`,
    redirect: './report/toilet-accessibility',
  } as const,
  {
    title: t`I have more information about this place.`,
    redirect: './report/osm-comment',
  } as const,
  {
    title: t`The place does not exist.`,
    redirect: './report/osm-non-existing',
  } as const,
  {
    title: t`The place is at the wrong location.`,
    redirect: './report/osm-position',
  } as const,
  {
    title: t`The problem isn't listed here...`,
    redirect: './report/mail-to-support',
  } as const,
] as const

function ReportPage() {
  const { features } = useContext(FeaturePanelContext)
  const feature = features[0]

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>

      <h2 className="_title">{t`Is there a problem with this place?`}</h2>

      {
        options.map((o) => (
          <div className="_option" key={o.redirect}>
            <AppStateLink href={o.redirect}>
              {o.title}
            </AppStateLink>
          </div>
        ))
      }

      <AppStateLink href="./">
        <div className="_option _back">{t`Back`}</div>
      </AppStateLink>
    </StyledReportView>
  )
}

ReportPage.getLayout = getLayout

export default ReportPage
