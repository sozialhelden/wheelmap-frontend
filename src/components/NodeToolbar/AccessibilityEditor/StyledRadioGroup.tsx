import { hsl } from 'd3-color'
import { RadioGroup } from 'react-radio-group'
import styled from 'styled-components'

import colors from '../../../lib/util/colors'
import { Caption } from '../../IconButton'

const StyledRadioGroup = styled(RadioGroup)`
  margin-top: 1em;

  label {
    transition: opacity 0.3s ease-out;
  }

  &.has-selection label:not(.is-selected) {
    opacity: 0.6;
  }

  label.yes:hover {
    background-color: ${colors.positiveBackgroundColorTransparent};
  }

  &.yes label.yes {
    background-color: ${colors.positiveBackgroundColorTransparent};
    > header span {
      color: ${hsl(colors.positiveColor).darker(1.6).toString()};
    }
  }

  label.limited:hover {
    background-color: ${colors.warningBackgroundColorTransparent};
  }

  &.limited label.limited {
    background-color: ${colors.warningBackgroundColorTransparent};
    > header span {
      color: ${hsl(colors.warningColor).darker(1.6).toString()};
    }
  }

  label.no:hover {
    background-color: ${colors.negativeBackgroundColorTransparent};
  }

  &.no label.no {
    background-color: ${colors.negativeBackgroundColorTransparent};
    > header span {
      color: ${hsl(colors.negativeColor).darker(1.6).toString()};
    }
  }

  label {
    padding: 0.5em;
    border-radius: 0.25em;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &.is-disabled {
      pointer-events: none;
      opacity: 0.8;
    }

    &[for='toilet-status'] {
      flex-direction: row;
      justify-content: space-between;
    }

    header {
      display: flex;
      align-items: center;
      font-weight: bold;
    }

    footer {
      margin: 0.5em 0 0 0;
      opacity: 0.8;
    }

    input {
      width: 0;
      height: 0;
      opacity: 0;
      box-sizing: border-box;
    }

    .radio-button {
      margin-right: 8px;

      &.focus-visible {
        border-radius: 100%;
        box-shadow: 0px 0px 0px 2px #4469e1;
      }
    }

    ${Caption} {
      flex: 1;
    }

    &:focus {
      background-color: yellow;
    }
  }
`

export default StyledRadioGroup
