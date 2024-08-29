import { FC, useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../lib/context/AppContext'
import StyledMarkdown from '../shared/StyledMarkdown'
import {
  LocationNoPermissionPrimaryText,
  selectProductName,
} from './language'
import { LocationSearch } from './components/LocationSearch'
import { KomootPhotonResultFeature } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  h1 {
    @media (min-width: 414px) {
      font-size: 1.25rem;
    }
    @media (min-height: 414px) {
      font-size: 1.25rem;
    }
  }

  > * {
    max-width: 400px;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
    gap: 24px;

    > .input,
    > .button {
      flex: 1;
    }
  }
`

export const LocationNoPermissionStep: FC<{
  onSubmit: (location?: KomootPhotonResultFeature) => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext)

  return (
    <Container>
      <StyledMarkdown>
        {LocationNoPermissionPrimaryText(
          selectProductName(clientSideConfiguration),
          'about:blank',
        )}
      </StyledMarkdown>
      <footer className="footer">
        <LocationSearch onUserSelection={onSubmit} />
      </footer>
    </Container>
  )
}
