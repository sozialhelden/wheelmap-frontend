// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import ChevronRight from '../ChevronRight';
import CheckmarkIcon from '../icons/actions/CheckmarkIcon';

import colors from '../../lib/colors';

export type Props = {
  hidden: boolean,
  onClose: ?(() => void),
  onCompleted: ?((files: FileList) => void),
};


type State = {
  enteredInstructionsValue?: string,
};

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  path { 
    fill: ${props => props.color};
  }
`;

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
      padding-left: 0;
      list-style: none;

      li {
        position: relative;
        margin-bottom: 0.8rem;
      
        p,
        small {
          display: inline-block;
          color: ${colors.primaryColorBrighter};
        }

        p {
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 0.5rem;
        }

        ul.photo-examples {
          padding-left: 0;
          display: flex;
          flex-wrap: wrap;     

          li {
            font-weight: 400;
            padding-right: 10px;
            margin-bottom: 0;
            
            &:last-child {
              padding-right: 0;
            }

            .placeholder-image {
              content: ' ';
              min-width: 72px;
              max-width: 98px;
              min-height: 72px;
              max-height: 98px;
              background-size: cover; 
              background-color: #EEE;
            } 
            
            .entrance-image { background-image: url('/images/placeholder-entrance@3x.png'); }
            .sitemap-image { background-image: url('/images/placeholder-sitemap@3x.png'); }
            .toilet-image { background-image: url('/images/placeholder-toilet@3x.png'); }
          
            small {
              font-size: 0.8rem;
              padding-left: 0;
            }
          }
        }
      }
      
      li.with-checkmark {

        p,
        small,
        ul {
          padding-left: 24px;
        }
                
        span {
          display: flex;
          position: relative;

          > svg {
            position: absolute;
            top: 0.3rem;
            left: -4px;
            display: inline-block;
            font-size: 1.7rem;
          } 
        }

        p {

        }
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

  input.hidden-file-input {
    visibility: hidden;
    display: none;
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
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
  }

  renderCloseLink() {
    return <button
      className='close-link'
      // translator: Button caption in photo upload Instructions dialog
      aria-label={t`Back`}
      onClick={this.onClose}
      ref={backLink => this.backLink = backLink}
    >← </button>;
  }


  onFileInputChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    var files = input.files;

    if (!files || files.length === 0) {
      if (this.props.onClose) {
        this.props.onClose();
      }
    } else {
      if (this.props.onCompleted) {
        this.props.onCompleted(files);
      }
    }
  }

  onClose = (event: UIEvent) => {
    if (this.props.onClose) {
      this.props.onClose();
      event.preventDefault();
    }
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
              <span><StyledCheckmarkIcon color={colors.linkColor} /><p>{t`...are interesting for accessibility.`}</p></span>
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
              <span><StyledCheckmarkIcon color={colors.linkColor} /><p>{t`...I made them myself. `}</p></span>
              <small>{t`Therefore I can give Wheelmap.org unlimited rights of use in form of a Creative Commons-License (CC).`}</small>{/* TODO: add link to CC */}
            </li>
            <li className='with-checkmark'>
              <span><StyledCheckmarkIcon color={colors.linkColor} /><p>{t`...do not contain any persons.`}</p></span>
              <small>{t`For identifiable persons, written consent must be obtained in accordance with the DSGVO.`}</small>{/* TODO: add link to DSGVO */}
            </li>
            <li className='with-checkbox'>
              <input type='checkbox' id='confirm'/>
              {/* <label for='confirm'>{t`...meet the terms of use.`}</label> TODO: fix label of checkbox, add link to terms of use*/}
              {/* <p>{t`...meet the terms of use.`}</p> */}
              <small>{t`I can read them here.`}</small>
            </li>
          </ul>
        </section>
        <footer>
          <button className='link-button negative-button' onClick={this.onClose}>{t`Cancel`}</button>
          <label className='link-button primary-button' htmlFor="photo-file-upload" >
            {t`Continue`}
          </label>
          <input 
            ref={(input => {this.inputField = input})}
            type='file'
            id="photo-file-upload"
            multiple={false}
            accept='image/*'
            onChange={this.onFileInputChanged}
            name='continue-upload'
            className='hidden-file-input' />
        </footer>
      </StyledToolbar>
    );
  }
}
