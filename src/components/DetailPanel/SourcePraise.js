// @flow
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';

import type SourceWithLicense from '../../app/PlaceDetailsProps';

type Props = {
  className?: string,
  sources: SourceWithLicense[],
};

const SourcePraise = ({ className, sources }: Props) => {
  // translator: Text explaining who provided the accessibility data for this place
  const preText = t`Data provided by`;
  // translator: Thank you notice for data providers
  const thanksText = t`Thanks`;
  return (
    <div className={className}>
      <p>{preText}</p>
      <ul>
        {sources.map(source => (
          <li key={source.source._id}>{source.source.shortName}</li>
        ))}
      </ul>
      <span role="img" aria-label="Raising Hands">
        🙌
      </span>
      {thanksText}
    </div>
  );
};
export default styled(SourcePraise)`
  text-align: center;

  p {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  ul {
    text-align: center;
    margin: 0 0 0.5rem 0;
    padding: 0;
    list-style-type: none;
  }

  li {
    font-size: 2rem;
  }

  img {
    max-width: 200px;
    max-height: 50px;
  }

  span[role='img'] {
    display: block;
    font-size: 2.5rem;
  }
`;
