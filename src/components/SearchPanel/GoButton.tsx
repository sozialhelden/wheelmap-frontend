import styled from 'styled-components'
import colors from '../../lib/util/colors'
import Button from '../shared/Button'

export const GoButton = styled(Button)`
  min-width: 4rem;
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0 7px;
  color: white;
  background-color: ${colors.linkColor};
  width: auto;

  &.focus-visible {
    box-shadow: inset 0px 0px 0px 2px #0f2775 !important;
  }

  &:hover {
    background-color: ${colors.linkColorDarker};
  }

  &:active {
    background-color: ${colors.darkLinkColor};
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
`
