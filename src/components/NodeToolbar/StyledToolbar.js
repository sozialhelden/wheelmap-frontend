import styled from 'styled-components';
import Toolbar from '../Toolbar';

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;

  top: 110px;
  max-height: calc(100% - 135px);

  @media (max-width: 512px), (max-height: 512px) {
    top: 50px;
  }

  p.sources {
    margin-top: .5em;
    font-size: 80%;
    opacity: 0.5;

    ul, li {
      display: inline;
      margin: 0;
      padding: 0;
    }

    li + li:before {
      content: ', ';
    }
  }
`;

export default StyledToolbar;
