import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import colors from '../../lib/util/colors'
import ModalDialog from '../shared/ModalDialog'
import { LocationFailedStep } from './LocationFailedStep'
import { LocationNoPermissionStep } from './LocationNoPermissionStep'
import { LocationStep } from './LocationStep'
import { OnboardingStep } from './OnboardingStep'
import { KomootPhotonResultFeature } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'

const StyledModalDialog = styled(ModalDialog)`
  isolation: isolate;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes appear {
    0% {
      transform: scale3d(1.2, 1.2, 1);
      opacity: 0;
    }

    100% {
      transform: scale3d(1, 1, 1);
      opacity: 1;
    }
  }

  @keyframes highlight {
    0% {
      transform: scale3d(1, 1, 1);
      background-color: ${colors.linkColor};
    }

    5% {
      transform: scale3d(1.05, 1.05, 1);
      background-color: ${colors.linkColorDarker};
    }

    10% {
      transform: scale3d(1, 1, 1);
      background-color: ${colors.linkColorDarker};
    }

    100% {
      transform: scale3d(1, 1, 1);
      background-color: ${colors.linkColor};
    }
  }

  @media (max-width: 320px) {
    font-size: 90%;
  }

  .modal-dialog-fullscreen-overlay {
    background-color: transparent;
  }

  .close-dialog {
    display: none;
  }

  .modal-dialog-content {
    display: flex;
    flex-direction: column;
    max-width: 80%;
    max-width: 800px;
    padding: 15px;
    overflow: auto;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.5s linear;
    width: 100%; /* Fix IE 11. @TODO Safe to be moved to ModalDialog component? */

    @media (max-height: 478px) {
      font-size: 0.8rem;
      #wheelmap-icon-descriptions {
        margin: 0;
      }
    }

    .logo {
      width: 250px;
      height: 53px; /* IE 11 does not preserve aspect ratio correctly and needs a fixed height. */

      @media (max-width: 414px) {
        width: 200px;
        height: 42px;
      }

      @media (max-height: 478px) {
        width: 150px;
        height: 32px;
      }

      object-fit: contain;
    }

    .claim {
      @media (min-width: 414px) {
        font-size: 1.25rem;
      }
      @media (min-height: 414px) {
        font-size: 1.25rem;
      }
    }

    > footer,
    > header,
    > section.main-section {
      text-align: center;
      max-width: 560px;
      align-self: center;
    }

    ul {
      display: flex;
      flex-direction: row;
      justify-content: center;

      list-style-type: none;

      @media (orientation: portrait) {
        align-items: start;
      }
      @media (orientation: landscape) {
        margin: 1rem 0;
      }

      /* @media (max-width: 768px) {
        margin: 0 !important;
      } */
      @media (max-width: 414px) {
        flex-direction: column !important;
      }
      @media (max-height: 414px) {
        flex-wrap: wrap;
      }

      li {
        /* flex: 1; */
        display: flex;
        flex-direction: column;

        justify-content: space-around;
        align-items: center;
        text-align: center;
        background-color: transparent;
        overflow-x: hidden;
        overflow-wrap: break-word;

        @media (max-width: 414px), (max-height: 414px) {
          height: 3em;
          flex-direction: row !important;
          text-align: left !important;
          /* padding: 0 10px !important; */

          figure {
            margin-right: 0.5rem;
            min-width: 30px;
            width: 30px;
            height: 30px;
          }
        }

        &:not(:last-child) {
          margin-right: 5px;
        }

        figure {
          top: 0;
          left: 0;
        }

        &.ac-marker-yes {
          color: ${colors.positiveColorDarker};
        }

        &.ac-marker-limited {
          color: ${colors.warningColorDarker};
        }

        &.ac-marker-no {
          color: ${colors.negativeColorDarker};
        }

        &.ac-marker-unknown {
          color: ${colors.markers.foreground.unknown};
          .ac-big-icon-marker {
            background-color: ${colors.markers.background.unknown};
          }
        }

        header {
          margin-bottom: 10px;
          max-width: 10rem;
          @media (max-width: 768px) {
            margin-bottom: 0px !important;
            flex: 1;
          }
          @media (min-width: 769px) {
            height: 3em;
          }
          min-height: 2em;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        footer {
          font-size: 90%;
          opacity: 0.7;
          display: none;
        }
      }
    }

    .ac-big-icon-marker {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      transform: none;
      animation: none;
      margin: 15px;
      left: auto;
      top: auto;
      svg {
        opacity: 0.6;
      }
    }
  }

  .button-footer {
    display: flex;
    flex-direction: column;
    min-height: 80px;

    .button-continue-with-cookies {
      margin: 0.5em;
    }
  }

  .cookies-footer {
    opacity: 0.5;
  }

  p {
    margin: 1em;
  }
`

type OnboardingState =
  | 'onboarding'
  | 'permission'
  | 'no-permission'
  | 'failed-permission';

type Props = {
  onClose: (location?: KomootPhotonResultFeature) => void;
};

const OnboardingDialog: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<OnboardingState>('onboarding')

  // simple dsa to change flow of the onboarding steps depending on what's more important
  // optional result for the permission step
  const stepFunctions = useMemo(
    () => ({
      onboardingFinished: () => {
        if (step === 'onboarding') {
          setStep('permission')
        }
      },
      onPermissionGranted: () => {
        if (step === 'permission') {
          onClose()
        }
      },
      onPermissionRejected: () => {
        if (step === 'permission') {
          setStep('no-permission')
        }
      },
      onPermissionFailed: () => {
        if (step === 'permission') {
          setStep('failed-permission')
        }
      },
      onPermissionError: (error: GeolocationPositionError) => {
        // todo: define behaviour or place it into a logger that's quiet in prod
        console.log('Something did not work quite right here', error)
        if (step === 'permission') {
          setStep('failed-permission')
        }
      },
      onRejectionSubmit: (location?: KomootPhotonResultFeature) => {
        onClose(location)
      },
      onLocationFailureResolved: (location?: KomootPhotonResultFeature) => {
        onClose(location)
      },
    }),
    [setStep, step, onClose],
  )

  const viewSelector = useCallback(
    (state: OnboardingState) => {
      switch (state) {
      case 'onboarding':
        return <OnboardingStep onClose={stepFunctions.onboardingFinished} />
      case 'permission':
        return (
          <LocationStep
            onAccept={stepFunctions.onPermissionGranted}
            onRejected={stepFunctions.onPermissionRejected}
            onFailed={stepFunctions.onPermissionFailed}
            onGeneralError={stepFunctions.onPermissionError}
          />
        )
      case 'no-permission':
        return (
          <LocationNoPermissionStep
            onSubmit={stepFunctions.onRejectionSubmit}
          />
        )
      case 'failed-permission':
        return (
          <LocationFailedStep
            onSubmit={stepFunctions.onLocationFailureResolved}
          />
        )
      default:
        return undefined
      }
    },
    [stepFunctions],
  )

  return (
    <StyledModalDialog
      isVisible
      onClose={onClose}
      ariaDescribedBy="wheelmap-claim-onboarding wheelmap-icon-descriptions"
      ariaLabel={t`Start screen`}
    >
      {viewSelector(step)}
    </StyledModalDialog>
  )
}

export default OnboardingDialog
