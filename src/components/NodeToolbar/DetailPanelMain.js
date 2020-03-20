import styled from 'styled-components';

export default styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 600px;
  margin-top: 3rem;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;

  > section {
    width: 40%;
  }

  > div {
    width: 40%;
  }

  @media (max-width: 512px) {
    flex-direction: column;

    > section {
      width: 100%;
    }

    > div {
      width: 100%;
    }
  }
`;
