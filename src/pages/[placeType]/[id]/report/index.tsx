import React, {
  useContext,
} from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { AppStateLink } from '../../../../components/App/AppStateLink'

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

export const StyledReportView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 24px;

  color: #000;

  ._view {
    display: contents;
  }

  ._title {
    font-size: 1.5rem;
  }

  ._subtitle, ._explanation {
    font-size: 1.1rem;
    opacity: 0.6;
  }

  ._option, ._option a {
    cursor: pointer;
    color: rgb(46, 108, 224);
    &:hover {
      color: rgb(46, 108, 224);
    }

    &._back {
      color: rgb(212, 12, 12);
      &:hover {
        color: rgb(212, 12, 12);
      }
    }
  }

  ._option {
    margin: 0 -10px;

    border-radius: 4px;
    background-color: transparent;
    padding: 10px;
    transition: 0.25s background-color ease;


    &:hover {
      background-color: rgba(0, 161, 255, 0.1);
    }

    &._back:hover {
      &:hover {
        background-color: rgba(245, 75, 75, 0.1);
      }
    }

    &._primary {
      &._disabled, &._disabled:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      &:hover {
        background-color: rgba(46, 108, 224, 0.877);
        color: white;
      }
      background-color: rgb(46, 108, 224);
      color: white;
    }
  }

  ._footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      padding: 10px 20px;
    }
  }
  a {
      text-decoration: none;
  }

  ._option > ._header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;

      font-weight: bold;

      > ._accessibility {
          visibility: hidden;
          display: none;
      }
  }

  ._option > ._main {
      li {
          color: black;
      }
  }

  ._option._yes {
      ._caption {
          color: rgb(71, 111, 10);
      }
      &, &:hover {
          background-color: rgba(126, 197, 18, 0.1);
      }
  }

  ._option._no {
      ._caption {
          color: rgb(171, 10, 10)
      }
      &, &:hover {
          background-color: rgba(245, 75, 75, 0.1);
      }
  }

  ._option._okay {
      ._caption {
          color: rgb(161, 91, 10)
      }

      &, &:hover {
          background-color: rgba(243, 158, 59, 0.1);
      }
  }
`

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

      <p className="_title">{t`Is there a problem with this place?`}</p>

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

ReportPage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default ReportPage
