import styled from 'styled-components'
import colors from '../../../../lib/util/colors'

export const StyledGallery = styled.div`
  display: flex;
  width: 100%;  
  gap: 4px;
  position: relative;
  isolation: isolate;

  > .images {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: 8px;
    max-height: 300px;
    overflow: hidden;
    transition: 0.5s max-height ease;
    > .image {
      cursor: pointer;
      border-radius: 10px;
      width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: cover;
      object-position: center bottom;
      transition: 0.5s max-height ease, 0.25s transform ease, 0.25s filter ease;
      filter: saturate(100%);

      &:hover {
        filter: saturate(120%);
      }
    }
  }

  > .wrapper {
    position: absolute;
    width: 100%;
    z-index: 1;
    bottom: -18px;
    display: flex;
    justify-content: center;
    > .foldout {
      background-color: ${colors.neutralBackgroundColor};
      color: ${colors.linkColor};
      padding: 8px;
      min-height: 24px;
      min-width: 200px;
      border-radius: 50px;
      border: none;
    }
  }

  &.open {
    > .images {
    max-height: 800px;
    overflow: scroll;
    > .image {
      max-height: 500px;
    }
    }
  }
`
