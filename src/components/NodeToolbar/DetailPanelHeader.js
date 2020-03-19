// @flow
import React, { type ReactElement } from 'react';
import styled from 'styled-components';
import colors from '../../lib/colors';

type Props = {
  title: string,
  subtitle: string,
  icon: ReactElement,
  className?: String,
};

const DetailPanelHeader = ({ title, subtitle, icon, className }: Props) => {
  return (
    <header className={className}>
      {icon}
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
};

export default styled(DetailPanelHeader)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  margin-top: -30px;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  color: ${colors.textColor};
  word-break: break-word;

  h1 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0;
    text-align: center;
  }

  p {
    color: ${colors.textColorBrighter};
    font-size: 1rem;
  }
`;
