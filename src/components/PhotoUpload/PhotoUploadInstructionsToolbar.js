// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import ChevronRight from '../ChevronRight';

import colors from '../../lib/colors';

export type Props = {
  hidden: boolean,
  onClose: ?(() => void),
  onCompleted: ?(() => void),
};


type State = {
  enteredInstructionsValue?: string,
};


/* Overwrite Style of wrapper Toolbar component  */
const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;

  > header {
    position: sticky;
    display: flex;
    top: 0;
    height: 50px;
    min-height: 50px;
    flex-direction: row-reverse;
    justify-content: space-between;
    z-index: 1;

    h3 {
      margin: 0.75rem 0;
    }
  
    /* TODO: Replace with standard component */
    .close-link {
      display: inline-block;
      position: sticky;
      float: right;
      padding: 0.5rem;
      font-size: 1.5rem;
      color: rgba(0, 0, 0, 0.3);
      background-color: rgba(251, 250, 249, 0.8);
      -webkit-backdrop-filter: blur(10px);
      border: 1px rgba(0, 0, 0, 0.01) solid;
      border-radius: 31px;
      text-decoration: none;
      text-align: center;
      z-index: 1;
      transform: translateZ(0);

      > svg {
        display: block;
      }
    }
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    ul {
      padding-left 0;
      list-style: none;

      li {
        position: relative;
        margin-bottom: 2rem;
      
        p,
        small {
          color: ${colors.primaryColorBrighter};
        }

        p {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        ul.photo-examples {
          padding-left: 0;
          display: flex;         

          li {
            font-weight: 400;
            padding-right: 10px;
            margin-bottom: 0;

            &.:last-child {
              padding-right: 0;
            }

            .placeholder-image {
              content: ' ';
              width: 98px;
              height: 98px;
              background-size: contain; 
              background-color: #EEE;
            } 
            
            .entrance-image { background-image: url('/images/placeholder-entrance@3x.png'); }
            .sitemap-image { background-image: url('/images/placeholder-sitemap@3x.png'); }
            .toilet-image { background-image: url('/images/placeholder-toilet@3x.png'); }
          }
        }
      }
      
      li.with-checkmark {
        margin-left: 24px;

        &:before {
          content: ' ';
          position: absolute;
          left: -26px;
          width: 20px;
          height: 20px;
          background-size: contain;
          background-image: url(' ');
          /* background: yellow; */
        }
      }

      li.with-checkbox {
        margin-left: 0;

        p,
        small {
          padding-left: 10px;
        }
      }
    }
  }


  > footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

export default class PhotoUploadInstructionsToolbar extends React.Component<Props, State> {
  props: Props;

  state = {
  };

  inputField: ?HTMLInputElement;
  backLink: ?React.ElementRef<typeof CloseLink>;
  goButton: ?React.ElementRef<'button'>;


  componentDidMount() {
    if (!this.props.hidden) {
      this.focus(); // Focus input field on start
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
  }

  focus() {
    this.inputField && this.inputField.focus();
  }

  renderInputField() {
    return <input type="text"
      ref={inputField => this.inputField = inputField}
      onFocus={(event) => {
        window.scrollTo(0, 0);  // Fix iOS mobile safari viewport out of screen bug
      }}
      onChange={event => this.setState({ enteredInstructionsValue: event.target.value })}
    />;
  }

  renderCloseLink() {
    return <button
      className='close-link'
      // translator: Button caption in photo upload Instructions dialog
      aria-label={t`Back`}
      onClick={() => {
        if (this.props.onClose) this.props.onClose();
      }}
      ref={backLink => this.backLink = backLink}
    >← </button>;
  }

  render() {
    return (
      <StyledToolbar
        className='photoupload-instructions-toolbar'
        hidden={this.props.hidden}
        isSwipeable={false}
        isModal
      >
        <header>
          {this.renderCloseLink()}
          <h3>{t`The following images...`}</h3>
        </header>
        <section>
          <ul>
            <li className='with-checkmark'>
              <p>{t`...are interesting for accessibility.`}</p>
              <ul className='photo-examples'>
                <li>
                  <div className='placeholder-image entrance-image'></div>
                  <small>{t`entrances`}</small>
                </li>
                <li>
                  <div className='placeholder-image sitemap-image'></div>
                  <small>{t`access plans`}</small>
                </li>
                <li>
                  <div className='placeholder-image toilet-image'></div>
                  <small>{t`toilets`}</small>
                </li>
              </ul>
            </li>
            <li className='with-checkmark'>
              <p>{t`...I made them myself. `}</p>
              <small>{t`Therefore I can give Wheelmap.org unlimited rights of use in form of a Creative Commons-License (CC).`}</small>
            </li>
            <li className='with-checkmark'>
              <p>{t`...do not contain any persons.`}</p>
              <small>{t`For identifiable persons, written consent must be obtained in accordance with the DSGVO.`}</small>
            </li>
            <li className='with-checkbox'>
              <input type='checkbox' id='confirm'/>
              {/* <label for='confirm'>{t`...meet the terms of use.`}</label> TODO: fix label of checkbox, add link*/}
              {/* <p>{t`...meet the terms of use.`}</p> */}
              <small>{t`I can read them here.`}</small>
            </li>
          </ul>
        </section>
        <footer>
          <button className='link-button negative-button'>{t`Cancel`}</button>
          <button className='link-button primary-button'>{t`Continue`}</button>
        </footer>
      </StyledToolbar>
    );
  }
}
