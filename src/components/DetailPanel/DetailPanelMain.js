import styled from 'styled-components';

export default styled.div`
  display: flex;
  max-width: 600px;
  margin-top: 2rem;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  justify-content: space-between;

  flex-direction: column;
  > section,
  > div {
    width: 100%;
  }

  @media (min-width: 620px) {
    flex-direction: row;

    > section,
    > div {
      width: 42%;
    }
  }
`;
