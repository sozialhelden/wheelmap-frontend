import { useRouter } from 'next/router'
import React, { FC, ReactElement, useRef } from 'react'
import { t } from 'ttag'
import Link from 'next/link'
import styled from 'styled-components'
import Toolbar from '../../../../components/shared/Toolbar'
import MapLayout from '../../../../components/App/MapLayout'
import { useMultipleFeatures } from '../../../../lib/fetchers/fetchMultipleFeatures'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import Spinner from '../../../../components/ActivityIndicator/Spinner'

const options = [
  {
    title: t`The place is rated as 'Not wheelchair accessible', but this is wrong!`,
    redirect: 'report/wheelchair-accessibility',
  } as const,
  {
    title: t`The accessibility to the toilet here is rated incorrectly or is missing.`,
    redirect: 'report/send-report-to-ac',
  } as const,
  {
    title: t`I have more information about this place.`,
    redirect: 'report/osm-comment',
  } as const,
  {
    title: t`The place does not exist.`,
    redirect: 'report/osm-non-existing',
  } as const,
  {
    title: t`The place is at the wrong location.`,
    redirect: 'report/osm-position',
  } as const,
  {
    title: t`The problem isn't listed here...`,
    redirect: 'report/mail-to-support',
  } as const,
] as const

export const StyledToolbar = styled(Toolbar)`
  color: black;
  > div {
    display: flex;
    flex-direction: column;
    gap: 12px;

    ._title {
      font-size: 1.5rem;
    }

    ._subtitle {
      font-size: 1.1rem;
      opacity: 0.6;
    }

    ._option, ._option a {
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
    }
  }
`

export const LoadingToolbar: FC = () => {
  const ref = useRef(null)
  return (
    <StyledToolbar innerRef={ref}>
      <div className="_loading" ref={ref}>
        <Spinner size={50} />
        <p className="_title">{t`Loading further details`}</p>
      </div>
    </StyledToolbar>
  )
}

export const ErrorToolBar: FC = () => {
  const ref = useRef(null)
  return (
    <StyledToolbar innerRef={ref}>
      <p className="_title" ref={ref}>Something did not work right</p>
    </StyledToolbar>
  )
}

function Report() {
  const router = useRouter()
  const { placeType, id } = router.query
  const features = useMultipleFeatures(`${placeType}:${id}`)
  const ref = useRef(null)

  if (features.isLoading || features.isValidating) {
    return <LoadingToolbar />
  }

  if (features.data === undefined) {
    return <ErrorToolBar />
  }

  const feature = features.data[0]

  return (
    <StyledToolbar innerRef={ref}>
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <p className="_title">Is there a problem with this place?</p>
      {
        options.map((x) => (
          <div className="_option">
            <Link href={{
              pathname: x.redirect,
              query: {
                placeType, id,
              },
            }}
            >
              {x.title}
            </Link>
          </div>
        ))
      }
    </StyledToolbar>
  )
}

Report.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default Report
