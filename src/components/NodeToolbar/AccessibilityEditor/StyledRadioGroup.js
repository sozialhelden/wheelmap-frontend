// @flow

import styled from 'styled-components';
import { RadioGroup } from 'react-radio-group';
import colors from '../../../lib/colors';

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
      color: ${colors.positiveColor};
    }
  }

  label.limited:hover {
    background-color: ${colors.warningBackgroundColorTransparent};
  }

  &.limited label.limited {
    background-color: ${colors.warningBackgroundColorTransparent};
    > header span {
      color: ${colors.warningColor};
    }
  }

  label.no:hover {
    background-color: ${colors.negativeBackgroundColorTransparent};
  }

  &.no label.no {
    background-color: ${colors.negativeBackgroundColorTransparent};
    > header span {
      color: ${colors.negativeColor};
    }
  }

  label {
    margin: -0.5em;
    padding: 0.5em;
    margin-bottom: 1em;
    border-radius: 0.25em;
    display: flex;
    flex-direction: column;
    &[for="toilet-status"] {
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
      opacity: 0.6;
      @media (max-width: 512px), (max-height: 512px) {
        font-size: 80%;
      }
    }
    cursor: pointer;
    input {
      width: 0;
      height: 0;
      opacity: 0;
      box-sizing: border-box;
    }
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
    .radio-button {
      margin-right: 8px;

      &.focus-ring {
        border-radius: 100%
      }
    }
    .caption {
      flex: 1;
    }
    &:focus {
      background-color: yellow;
    }
  }
`;

export default StyledRadioGroup;
