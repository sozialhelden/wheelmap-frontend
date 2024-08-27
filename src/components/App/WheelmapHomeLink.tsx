import React, { useContext } from 'react'
import { t } from 'ttag'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import * as queryString from 'query-string'
import { omit } from 'lodash'
import VectorImage from '../shared/VectorImage'
import { translatedStringFromObject } from '../../lib/i18n/translatedStringFromObject'
import { AppContext } from '../../lib/context/AppContext'

type Props = {
  className?: string,
};

const StyledLink = styled.a`
  border-radius: 4px;
  background-color: rgba(254, 254, 254, 0.8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 4px;
`

export default function WheelmapHomeLink(props: Props) {
  const { clientSideConfiguration } = useContext(AppContext)
  const router = useRouter()
  const queryStringWithoutEmbeddedParam = queryString.stringify(omit(router.query, 'embedded'))
  const homeLinkHref = `${window.location.pathname}?${queryStringWithoutEmbeddedParam}`
  const appName = translatedStringFromObject(clientSideConfiguration?.textContent?.product?.name)

  return (
    <StyledLink
      className={props.className}
      href={homeLinkHref}
      // translator: The link name to go from the embedded to the complete app
      aria-label={t`Go to ${appName}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <VectorImage
        svg={clientSideConfiguration?.branding?.vectorLogoSVG}
        aria-label={t`App Logo`} /* translator: The alternative desription of the app logo for screenreaders */
        className="logo"
        maxHeight="30px"
        maxWidth="150px"
        hasShadow={false}
      />
    </StyledLink>
  )
}
