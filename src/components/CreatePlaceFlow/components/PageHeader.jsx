import styled from 'styled-components';

export default styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  position: sticky;
  top: 0px;
  background: white;
  z-index: 5000;

  h2 {
    margin: 0;
    flex: 1;
    text-align: center;
  }
`;
