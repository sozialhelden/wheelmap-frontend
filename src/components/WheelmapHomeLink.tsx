import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import { ClientSideConfiguration } from '../lib/ClientSideConfiguration';
import { translatedStringFromObject } from '../lib/i18n';
import VectorImage from './VectorImage';

type Props = {
  className?: string,
  href: string,
  clientSideConfiguration: ClientSideConfiguration,
};

const WheelmapHomeLink = (props: Props) => {
  const appName = translatedStringFromObject(
    props.clientSideConfiguration?.textContent?.product?.name
  );

  return (
    <a
      className={props.className}
      href={props.href}
      // translator: The link name to go from the embedded to the complete app
      aria-label={t`Go to ${appName}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <VectorImage
        svg={props.clientSideConfiguration?.branding?.vectorLogoSVG}
        aria-label={t`App Logo`} /* translator: The alternative desription of the app logo for screenreaders */
        className="logo"
        maxHeight={'30px'}
        maxWidth={'150px'}
        hasShadow={false}
      />
    </a>
  );
};

const StyledWheelmapHomeLink = styled(WheelmapHomeLink)`
  border-radius: 4px;
  background-color: rgba(254, 254, 254, 0.8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 4px;
`;

export default StyledWheelmapHomeLink;
