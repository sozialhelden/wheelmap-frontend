import styled from 'styled-components'
import colors from '../../../lib/util/colors'

const StyledFrame = styled.div.attrs({ noseOffsetX: 10, className: 'styled-frame' })`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 1rem 0 1rem 0;
  padding: 0.75rem 0.75rem 2px 0.75rem;
  border: 1px solid ${colors.borderColor};
  border-radius: 4px;

  &:empty {
    display: none;
  }

  &:before {
    display: block;
    position: absolute;
    content: ' ';
    top: -8px;
    left: ${(props) => props.noseOffsetX || 10}px;
    width: 12px;
    height: 8px;
    background: url('/images/triangle.svg') no-repeat;
    z-index: 1;
  }

  > * {
    margin: 1rem 0;
  }

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  header {
    :first-child {
      margin: 0;
    }
    &:not(:first-child) {
      margin: 0.25rem 0 0 0;
    }
  }

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export default StyledFrame
