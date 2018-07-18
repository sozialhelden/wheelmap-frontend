// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';
import { Dots } from 'react-activity';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import CheckmarkIcon from '../icons/actions/CheckmarkIcon';

import colors from '../../lib/colors';
import entrancePlaceholder from './entrancePlaceholder.png';
import sitemapPlaceholder from './sitemapPlaceholder.png';
import toiletPlaceholder from './toiletPlaceholder.png';
export type Props = {
  hidden: boolean,
  waitingForPhotoUpload?: boolean;
  onClose: ?(() => void),
  onCompleted: ?((photos: FileList) => void),
};


type State = {
  guidelinesAccepted?: boolean,
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
      font-size: 2rem;
      padding-bottom: 8px;
      color: rgba(0, 0, 0, 0.2);
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
        margin-bottom: 1rem;
      
        p,
        small {
          display: inline-block;
          color: ${colors.primaryColorBrighter};
        }

        p {
          font-weight: 600;
          margin-bottom: 0.25rem;
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

            .entrance-image { background-image: url('${entrancePlaceholder}'); }
            .sitemap-image { background-image: url('${sitemapPlaceholder}'); }
            .toilet-image { background-image: url('${toiletPlaceholder}'); }
          
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
          pointer-events: none;
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
      }

      li.with-checkbox {
        &, * {
          cursor: pointer;
        }
        margin: -10px;
        padding: 10px;
        border-radius: 4px;

        &:hover {
          background-color: ${colors.linkBackgroundColorTransparent};
        }

        label {
          padding-left: 6px;
          font-weight: 600;
          color: ${colors.primaryColorBrighter};
          user-select: none;
        }
        
        small { 
          padding-left: 26px; 
        }
      }
    }
  }

  > footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    label.link-button {
      text-align: center;
    }
  }

  .file-label {
    position: relative;

    input.hidden-file-input {
      position: absolute;
      opacity: 0;
      left: 0;
      width: 100%;
      top: 0;
      height: 100%;
    }
  }
  
  .link-button[disabled] {
    opacity: 0.8;
    background-color: ${colors.neutralBackgroundColor};
  }
`;

export default class PhotoUploadInstructionsToolbar extends React.Component<Props, State> {
  props: Props;

  state: State = {
    guidelinesAccepted: false
  };

  fileInput: ?HTMLInputElement;
  checkBox: ?HTMLInputElement;
  backLink: ?React.ElementRef<typeof CloseLink>;
  goButton: ?React.ElementRef<'button'>;

  renderCloseLink() {
    return <button
      className='close-link'
      // translator: Button caption in photo upload Instructions dialog
      aria-label={t`Close`}
      onClick={this.onClose}
      ref={backLink => this.backLink = backLink}
    >× </button>;
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

  onGuidelinesAcceptedChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    const input = this.checkBox;
    if (!input) {
      return;
    }
    this.setState({ guidelinesAccepted: input.checked });
    event.stopPropagation();
  }

  render() {
    const { guidelinesAccepted } = this.state;
    const { waitingForPhotoUpload } = this.props;
    const canSubmit = guidelinesAccepted && !waitingForPhotoUpload;

    return (
      <StyledToolbar
        className='photoupload-instructions-toolbar'
        hidden={this.props.hidden}
        isSwipeable={false}
        isModal
      >
        <header>
          {this.renderCloseLink()}
          <h3>{t`The following images…`}</h3>
        </header>
        <section>
          <ul>
            <li className='with-checkmark'>
              <span><StyledCheckmarkIcon color={colors.linkColor} /><p>{t`…are interesting for accessibility.`}</p></span>
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
              <span><StyledCheckmarkIcon color={colors.linkColor} /><p>{t`…were made by myself. `}</p></span>
              <small>{t`Therefore I can give Wheelmap.org unlimited rights of use in form of a `}
              <a href="https://creativecommons.org/licenses/" target="new">{t`Creative Commons-License (CC)`}</a></small> {/* TODO: add link to CC */}
            </li>
            <li className='with-checkmark'>
              <span><StyledCheckmarkIcon color={colors.linkColor} /><p>{t`…do not contain any persons.`}</p></span>
              <small>{t`For identifiable persons, written consent must be obtained in accordance with the `}
              <a href="https://de.wikipedia.org/wiki/Datenschutz-Grundverordnung" target="new">{t`DSGVO`}</a></small> {/* TODO: add link to DSGVO */}
            </li>
            <li className='with-checkbox'>
              <input 
                ref={cb => this.checkBox = cb}
                type='checkbox'
                id='confirm-guidelines'
                checked={guidelinesAccepted}
                value='confirm-guidelines'
                onChange={this.onGuidelinesAcceptedChanged} />
              <label htmlFor='confirm-guidelines'>{t`…meet our guidelines.`}</label><br/>
              <small>{t`I can read them `}<a href="https://news.wheelmap.org/datenschutzerklaerung/" target="new">{t`here`}</a></small> {/* TODO: add link to guidelines */}
            </li>
          </ul>
        </section>
        <footer>
          <button 
            className='link-button negative-button' 
            onClick={this.onClose}>
            {t`Cancel`}
          </button>
          <label 
            className='link-button primary-button file-label' 
            disabled={!canSubmit}
            htmlFor="photo-file-upload">
            {t`Continue`} 
            {waitingForPhotoUpload && <Dots />}
            <input 
              ref={(input => {this.fileInput = input})}
              type='file'
              id="photo-file-upload"
              multiple={false}
              accept='image/*'
              onChange={this.onFileInputChanged}
              disabled={!canSubmit}
              name='continue-upload'
              className='hidden-file-input' />
          </label>
        </footer>
      </StyledToolbar>
    );
  }
}
