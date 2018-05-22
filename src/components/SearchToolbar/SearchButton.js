// @flow

import * as React from 'react';
import SearchIcon from './SearchIcon';
import MapButton from '../MapButton';
import { t } from 'c-3po';
import styled from 'styled-components';

type Props = {
  onClick: (() => void),
  className: string,
}


function SearchButton(props: Props) {
  const classNames = [
    'btn-unstyled',
    'search-button',
    props.className,
  ]
  return (
    <MapButton
      {...props}
      aria-label={t`Search`}
      aria-controls="search"
      className={classNames.join(' ')}
    >
      <SearchIcon />
    </MapButton>
  );
}

const StyledSearchButton = styled(SearchButton)`
  svg {
    width: 20px;
    height: 20px;
    path {
      fill: #334455;
    }
  }
`;

export default StyledSearchButton;
