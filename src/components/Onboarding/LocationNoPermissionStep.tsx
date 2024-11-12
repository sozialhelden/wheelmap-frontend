import { FC, useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../lib/context/AppContext'
import StyledMarkdown from '../shared/StyledMarkdown'
import { LocationNoPermissionPrimaryText, selectProductName } from './language'
import { LocationSearch } from './components/LocationSearch'
import { PhotonResultFeature } from '../../lib/fetchers/fetchPhotonFeatures'
import { getLocationSettingsUrl } from '../../lib/goToLocationSettings'
import { LocationContainer } from './components/LocationContainer'

const Container = styled(LocationContainer)`
  .footer {
    > .input,
    > .button {
      flex: 1;
    }
  }
`

export const LocationNoPermissionStep: FC<{
  onSubmit: (location?: PhotonResultFeature) => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext) ?? { }
  const [url] = getLocationSettingsUrl()
  return (
    <Container>
      <StyledMarkdown>
        {LocationNoPermissionPrimaryText(
          selectProductName(clientSideConfiguration),
          url,
        )}
      </StyledMarkdown>
      <footer className="footer">
        <LocationSearch onUserSelection={onSubmit} />
      </footer>
    </Container>
  )
}
