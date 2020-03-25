import styled, { css } from 'styled-components';
import colors from '../../../lib/colors';

export const sharedInputStyle = css`
  width: 100%;

  padding: 0 0.25rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 2rem;

  border: 1px solid ${colors.inputBorder};
  border-radius: 0.25rem;
  box-sizing: border-box;
  box-shadow: none;

  &:focus[data-focus-visible-added] {
    border-color: ${colors.focusOutline};
    box-shadow: 0 0 0px 3px ${colors.focusOutline};
    outline: none;
  }

  &.is-invalid {
    color: ${colors.negativeColor};
    /* border-color: transparent; */
    border-color: ${colors.halfTransparentNegative};
    box-shadow: none;
    &:focus[data-focus-visible-added] {
      border-color: ${colors.halfTransparentNegative};
      box-shadow: 0 0 0px 3px ${colors.halfTransparentNegative};
    }
  }

  &:disabled {
    background-color: transparent;
    color: ${colors.textMuted};
  }
`;

const InputField = styled.input`
  ${sharedInputStyle}
`;

export default InputField;
