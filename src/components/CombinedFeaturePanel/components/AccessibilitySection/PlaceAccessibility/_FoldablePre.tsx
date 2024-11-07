import { FC, useState } from 'react'
import styled from 'styled-components'
import colors from '../../../../../lib/util/colors'
import SvgCave from '../../../../icons/categories/cave'

const StyledFoldoutDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;

  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: ${colors.coldBackgroundColor};

  width: 100%;
  > span {
    padding: 4px;
    height: min-content;
    > svg {
      padding: 0;
      margin: 0;
      width: 14px;
      height: 14px;
      transform: rotate(90deg);
      transition: 0.25s transform ease;
    }
  }


  > pre {
    margin: 0;
    padding: 0 12px;
    transition: 0.25s max-height ease, 0.25s margin ease;
    overflow: hidden;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
  }

  &.unfolded {
    > span {
      > svg {
        transform: rotate(180deg)
      }
    }
    > pre {
      margin: 4px 0;
      max-height: 300px;
      overflow: auto;
    }
  }
  &.folded {
    > pre {
      max-height: 0;
    }
  }
`

export const FoldablePre: FC<{
  children: string | undefined,
  defaultFolding?: 'folded' | 'unfolded'
}> = ({ children, defaultFolding = 'folded' }) => {
  const [folded, setFolded] = useState(defaultFolding === 'folded')

  if (!children) {
    return <StyledFoldoutDiv>[No Data]</StyledFoldoutDiv>
  }
  return (
    <StyledFoldoutDiv className={folded ? 'folded' : 'unfolded'}>
      <span role="button" tabIndex={0} onClick={() => { setFolded(!folded) }} onKeyDown={() => { setFolded(!folded) }}>
        <SvgCave height="14px" width="14px" />
        {' '}
        Technical Data
      </span>
      <pre>{children}</pre>
    </StyledFoldoutDiv>
  )
}
