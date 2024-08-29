import * as React from 'react'
import { useEffect } from 'react'
import { AppContext } from '../../lib/context/AppContext'
import {
  accessibilityDescription,
  accessibilityName,
} from '../../lib/model/accessibility/accessibilityStrings'
import ChevronRight from '../icons/actions/ChevronRight'
import { CallToActionButton } from '../shared/Button'
import Icon from '../shared/Icon'
import VectorImage from '../shared/VectorImage'
import {
  selectHeaderMarkdownHTML,
  selectProductName,
  startButtonCaption,
  unknownAccessibilityIncentiveText,
} from './language'

export const OnboardingStep: React.FC<{
  onClose?: () => unknown;
}> = ({ onClose = () => { } }) => {
  const { clientSideConfiguration } = React.useContext(AppContext)
  const headerMarkdownHTML = selectHeaderMarkdownHTML(clientSideConfiguration)

  const callToActionButton = React.createRef<HTMLButtonElement>()
  const handleClose = () => {
    // Prevent that touch up opens a link underneath the primary button after closing
    // the onboarding dialog
    setTimeout(() => onClose(), 10)
  }

  useEffect(() => {
    setTimeout(() => {
      callToActionButton.current?.focus()
    }, 100)
  }, [callToActionButton])

  return (
    <>
      <header>
        <VectorImage
          className="logo"
          svg={clientSideConfiguration.branding?.vectorLogoSVG}
          aria-label={selectProductName(clientSideConfiguration)}
          maxHeight="50px"
          maxWidth="200px"
          hasShadow={false}
        />

        {headerMarkdownHTML && (
          <p
            id="wheelmap-claim-onboarding"
            className="claim"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: headerMarkdownHTML }}
          />
        )}
      </header>
      <section>
        <ul id="wheelmap-icon-descriptions">
          <li className="ac-marker-yes">
            <Icon
              accessibility="yes"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('yes')}</header>
            <footer>{accessibilityDescription('yes')}</footer>
          </li>
          <li className="ac-marker-limited">
            <Icon
              accessibility="limited"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('limited')}</header>
            <footer>{accessibilityDescription('limited')}</footer>
          </li>
          <li className="ac-marker-no">
            <Icon
              accessibility="no"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('no')}</header>
            <footer>{accessibilityDescription('no')}</footer>
          </li>
          <li className="ac-marker-unknown">
            <Icon
              accessibility="unknown"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('unknown')}</header>
            <footer>{unknownAccessibilityIncentiveText}</footer>
          </li>
        </ul>
      </section>
      <footer className="button-footer">
        <CallToActionButton
          className="button-continue"
          data-focus-visible-added
          onClick={handleClose}
          ref={callToActionButton}
        >
          {startButtonCaption}
          <ChevronRight />
        </CallToActionButton>
      </footer>
    </>
  )
}
