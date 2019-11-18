import styled from 'styled-components';

const PlaceName = styled.h1.attrs({isSmall: false})`
  margin: 0;
  line-height: 1;
  font-weight: 400;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  word-break: break-word;
  font-size: ${props => (props.isSmall ? 'inherit' : '20px')};
  font-weight: ${props => (props.isSmall ? '500' : '400')};

  figure {
    margin-right: 5px;
    margin-left: -3px;
    left: 0;
    top: 0;
  }
`;

export default PlaceName;
