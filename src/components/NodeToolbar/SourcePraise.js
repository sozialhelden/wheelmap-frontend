// @flow
import * as React from 'react';
import styled from 'styled-components';

type Props = {
  className?: string,
};

const SourcePraise = ({ className }: Props) => {
  return (
    <div className={className}>
      <p>This data has been provided by</p>
      <img src="/images/openstreetmap.png" alt="Open Street Map Logo" />
      <p>
        – Thanks!{' '}
        <span role="img" aria-label="Raising Hands Emoji">
          🙌
        </span>
      </p>
    </div>
  );
};
export default styled(SourcePraise)`
  p {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  img {
    max-width: 200px;
    max-height: 50px;
  }
`;
