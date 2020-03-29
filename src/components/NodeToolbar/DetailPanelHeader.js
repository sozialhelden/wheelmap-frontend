// @flow
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';

import colors from '../../lib/colors';
import { ChromelessButton } from '../Button';
import PhotoUploadButton from '../PhotoUpload/PhotoUploadButton';
import { StyledIconContainer } from '../Icon';
import BackButton from './BackButton';

type Props = {
  title: ?string,
  subtitle: ?string,
  icon: React.Node,
  photoUploadButtonElement: ?React.Node,
  onCloseButtonClick: () => void,
  className?: string,
};

const DetailPanelHeader = ({
  title,
  subtitle,
  icon,
  onCloseButtonClick,
  photoUploadButtonElement,
  className,
}: Props) => {
  const buttonText = t`back`;
  return (
    <header className={className}>
      <BackButton onClick={onCloseButtonClick}>{buttonText}</BackButton>
      <div>
        {icon}
        {title && <h1>{title}</h1>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {photoUploadButtonElement}
    </header>
  );
};

export default styled(DetailPanelHeader)`
  position: relative;
  max-width: 600px;
  margin: 0 auto;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 300px;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    color: ${colors.textColor};
    word-break: break-word;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 0;
    text-align: center;
    max-width: 150px;

    @media (min-width: 513px) {
      max-width: 300px;
    }
  }

  p {
    color: ${colors.textColorBrighter};
    font-size: 1rem;
  }

  ${StyledIconContainer} {
    top: -30px;
  }

  ${BackButton} {
    position: absolute;
    top: 1rem;
    left: 0;
  }

  ${PhotoUploadButton} {
    position: absolute;
    top: 0;
    right: 0;

    ${ChromelessButton}:hover {
      background-color: transparent;
    }
  }
`;
