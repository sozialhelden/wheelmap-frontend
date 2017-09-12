import * as React from 'react';
import styled from 'styled-components';
import ModalDialog from '../ModalDialog';
import ChevronRight from '../icons/actions/ChevronRight';
import logo from '../../lib/Logo.svg';
import Icon from '../Icon';
import colors from '../../lib/colors';
import { hsl } from 'd3-color';


function Onboarding(props) {
  return (<ModalDialog className={props.className} isVisible={props.isVisible} onClose={props.onClose}>
    <header>
      <img alt="" className="logo" src={logo} />
      <p>Mark and find wheelchair accessible places—worldwide and for free. It’s easy with our traffic light system:</p>
    </header>

    <section>
      <ul>
        <li className="ac-marker-green">
          <Icon overriddenColor="green" category={{ _id: 'other' }} isBig={true} />
          <header>Wheelchair accessible</header>
          <footer>Entrance without steps, all rooms without steps.</footer>
        </li>
        <li className="ac-marker-yellow">
          <Icon overriddenColor="yellow" category={{ _id: 'other' }} isBig={true} />
          <header>Partially wheelchair accessible</header>
          <footer>Entrance has one step with max. height 7cm (3 in), most rooms are without steps.</footer>
        </li>
        <li className="ac-marker-red">
          <Icon overriddenColor="red" category={{ _id: 'other' }} isBig={true} />
          <header>Not wheelchair accessible</header>
          <footer>Entrance has a step or several steps, rooms are not accessible.</footer>
        </li>
        <li className="ac-marker-gray">
          <Icon overriddenColor="gray" category={{ _id: 'other' }} isBig={true} />
          <header>Unknown status</header>
          <footer>Help out by marking places!</footer>
        </li>
      </ul>
    </section>

    <footer>
      <button className="button-cta-close" onClick={props.onClose}>Okay, let’s go! <ChevronRight /></button>
    </footer>
  </ModalDialog>);
}


const StyledOnboarding = styled(Onboarding)`
  @media (max-height: 320px), (max-width: 320px) {
    font-size: 90%;
  }
  .close-dialog {
    display: none;
  }
  .modal-dialog-content {
    padding: 15px;
    display: flex;
    flex-direction: row;
    overflow: auto;
    img.logo {
      width: 200px;
    }
    @media (max-width: 768px) {
      > header {
        img.logo {
          width: 150px;
        }
      }
    }
    @media (max-width: 1199px) {
      flex-direction: column !important;
      > footer, > header {
        text-align: center;
        width: 75%;
        margin: 0 12.5%;
      }
    }
    @media (min-width: 1200px) {
      justify-content: center;
      align-items: center;
      > header, footer {
        flex: 1;
      }
      > section {
        flex: 2;
      }
    }

    max-width: 1200px;

    ul {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: start;
      list-style-type: none;
      margin: 50px 0;
      padding: 0px;
      @media (max-width: 768px) {
        margin: 10px 0 !important;
      }
      @media (max-width: 400px) {
        flex-direction: column !important;
      }

      li {
        flex: 1;
        display: flex;
        flex-direction: column;

        justify-content: space-around;
        align-items: center;
        text-align: center;
        background-color: transparent;

        @media (max-width: 400px) {
          height: 4em;
          flex-direction: row !important;
          text-align: left !important;
          padding: 0 10px !important;
          figure {
            width: 40px;
            height: 40px;
          }
        }

        &.ac-marker-green {
          color: ${hsl(colors.markerBackground.green).darker(0.5)};
        }

        &.ac-marker-yellow {
          color: ${hsl(colors.markerBackground.yellow).darker(0.5)};
        }

        &.ac-marker-red {
          color: ${hsl(colors.markerBackground.red).darker(0.5)};
        }

        &.ac-marker-gray {
          color: ${hsl(colors.markerBackground.gray).darker(2)};
          .ac-big-icon-marker {
            background-color: ${colors.markerBackground.gray};
          }
        }

        header {
          margin-bottom: 10px;
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
          /*@media (max-width: 768px) {*/
            display: none;
          /*}*/
        }

      }
    }

    button.button-cta-close {
      border: none;
      outline: none;
      color: white;
      background-color: ${colors.linkColor};
      font-size: 1.25em;
      line-height: 1;
      padding: 0.5em 0.75em;
      margin: 1em;
      cursor: pointer;
      > svg {
        margin-left: 10px;
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
`;

export default StyledOnboarding;


export function saveOnboardingFlag() {
  localStorage.setItem('wheelmap.onboardingCompleted', 'true');
}

export function isOnboardingVisible() {
  return localStorage.getItem('wheelmap.onboardingCompleted') !== 'true';
}
