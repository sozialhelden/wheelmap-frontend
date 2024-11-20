import styled from 'styled-components'
import colors from '../../lib/util/colors'

export const StyledPhotoUploadView = styled.div`
  color: ${colors.textColor};

  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;

  > .title {
    font-size: 24px;
    font-weight: 700;
  }

  > .entry {
    display: flex;
    flex-direction: column;
    gap: 8px;

    > .description {
      display: flex;
      gap: 8px;
      align-content: center;

      > .checkmark > path {
        fill: ${colors.linkColor};
      }
    }

    > .details {
      width: 100%;
      color: ${colors.textColorTonedDown};

      &.pictograms {
      display: grid;
      grid-gap: 8px;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
      
      > .graphic {
        width: 100%;
        padding: 0;
        margin: 0;

        > img {
          max-width: 100%;
        }

        > figcaption {
          display: flex;
          justify-content: center;
        }
        
      }
    }
    }
  }

  > .actions {
    display: flex;
    justify-content: space-between;

    > * > .cancel {
      color: ${colors.negativeColor};

      &:hover {
        background-color: ${colors.negativeBackgroundColorTransparent};
        color: ${colors.negativeColorDarker};

      }
    }

    > .accept {
      color: ${colors.positiveColorDarker};
      background-color: ${colors.positiveBackgroundColorTransparent};
      &:hover {
        background-color: ${colors.positiveBackgroundColorTransparent};
        color: ${colors.positiveColorDarker};
      }
    }

    > * > .neutral, > .neutral {
      color: ${colors.linkColor};
      background-color: ${colors.linkBackgroundColorTransparent};
      &:hover {
        background-color: ${colors.linkBackgroundColorTransparent};
        color: ${colors.linkColorDarker};
      }
    }
  }

  > .spinner {
      padding: 20px;
      width: 100%;
    > .loader {
      height: 4px;
      width: 100%;
      --c:no-repeat linear-gradient(${colors.neutralColor} 0 0);
      background: var(--c),var(--c),${colors.neutralBackgroundColor};
      background-size: 60% 100%;
      animation: l16 3s infinite;
      @keyframes l16 {
        0%   {background-position:-150% 0,-150% 0}
        66%  {background-position: 250% 0,-150% 0}
        100% {background-position: 250% 0, 250% 0}
      }
    }

  }
`
