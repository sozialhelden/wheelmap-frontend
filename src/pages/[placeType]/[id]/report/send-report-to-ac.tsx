import { useRouter } from 'next/router'
import {
  FC,
  ReactElement, ReactNode, useRef, useState,
} from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import Link from 'next/link'
import { ErrorToolBar, LoadingToolbar, StyledToolbar as ReportStyledToolbar } from '.'
import MapLayout from '../../../../components/App/MapLayout'
import { useMultipleFeatures } from '../../../../lib/fetchers/fetchMultipleFeatures'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import ToiletStatusAccessible from '../../../../components/icons/accessibility/ToiletStatusAccessible'
import ToiletStatusNotAccessible from '../../../../components/icons/accessibility/ToiletStatusNotAccessible'
import RadioButtonOn from '../../../../components/icons/ui-elements/RadioButtonSelected'
import RadioButtonOff from '../../../../components/icons/ui-elements/RadioButtonUnselected'
import { cx } from '../../../../lib/util/cx'

const StyledToolbar = styled(ReportStyledToolbar)`

  a {
    text-decoration: none;
  }

  ._option > ._header {
    display: flex;
    flex-direction: row;
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
      color: rgb(111, 10, 10);
    }
    &, &:hover {
      background-color: rgba(245, 75, 75, 0.1);
    }
  }
`

const AccessibilityView: FC<{
  onClick: () => unknown,
  className?: string,
  inputLabel: string,
  children?: ReactNode
  selected: boolean
  icon: ReactNode,
  valueName: string
}> = ({
  onClick, className, inputLabel, children, selected, icon, valueName,
}) => (
  <div className={cx('_option', className)} onClick={onClick} role="option" onKeyDown={onClick}>
    <label htmlFor={inputLabel} />
    <header className="_header">
      <input id={inputLabel} className="_accessibility" aria-label="Yes" type="radio" name="accessibility" value="yes" />
      { selected ? <RadioButtonOn /> : <RadioButtonOff /> }
      { icon }
      <span className="_caption" aria-hidden="true">{valueName}</span>
    </header>
    {children && (<main className="_main">{children}</main>)}
  </div>
)

function ReportSendToAC() {
  const router = useRouter()
  const { placeType, id } = router.query
  const features = useMultipleFeatures(`${placeType}:${id}`)
  const ref = useRef(null)
  const [option, setOption] = useState<'yes' | 'no' | undefined>(undefined)

  if (features.isLoading || features.isValidating) {
    return <LoadingToolbar />
  }

  if (features.data === undefined) {
    return <ErrorToolBar />
  }
  const feature = features.data[0]

  return (
    <StyledToolbar innerRef={ref}>

      <div className="_view" ref={ref}>
        <FeatureNameHeader feature={feature}>
          {feature['@type'] === 'osm:Feature' && (
            <FeatureImage feature={feature} />
          )}
        </FeatureNameHeader>
        <div className="_title">Is the toilet here wheelchair accessible?</div>
        <form>
          <AccessibilityView
            onClick={() => { setOption('yes') }}
            className="_yes"
            inputLabel="accessibility-yes"
            selected={option === 'yes'}
            icon={<ToiletStatusAccessible />}
            valueName="Yes"
          >
            <ul>
              <li>{t`Doorways' inner width ≥ 35 inches`}</li>
              <li>{t`Clear turning space ≥ 59 inches`}</li>
              <li>{t`Wheelchair-height toilet seat`}</li>
              <li>{t`Foldable grab rails`}</li>
              <li>{t`Accessible sink`}</li>
            </ul>
          </AccessibilityView>

          <AccessibilityView
            onClick={() => { setOption('no') }}
            className="_no"
            inputLabel="accessibility-no"
            selected={option === 'no'}
            icon={<ToiletStatusNotAccessible />}
            valueName="No"
          />
        </form>

        <footer className="_footer">
          <Link href={{ pathname: '../report', query: { placeType, id } }}><div role="button" className="_option _back">Back</div></Link>
          { /* @TODO: Implementing the sending request */}
          <div role="button" className={cx('_option', '_primary', option === undefined && '_disabled')}>Continue</div>
        </footer>
      </div>
    </StyledToolbar>
  )
}

ReportSendToAC.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default ReportSendToAC
