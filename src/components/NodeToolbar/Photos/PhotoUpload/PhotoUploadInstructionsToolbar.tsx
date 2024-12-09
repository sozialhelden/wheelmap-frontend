import FocusTrap from 'focus-trap-react'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import colors from '../../../../lib/util/colors'
import Spinner from '../../../ActivityIndicator/Spinner'
import { CheckmarkIcon } from '../../../icons/actions'
import Toolbar from '../../../shared/Toolbar'
import CloseButton from '../../../shared/CloseButton'

export type Props = {
  waitingForPhotoUpload: boolean;
  onClose: () => void | null;
  onCompleted: (photos: FileList) => void | null;
};

type State = {
  guidelinesAccepted: boolean;
};

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  height: 1rem;
  path {
    fill: ${(props) => props.color};
  }
`

/* Overwrite Style of wrapper Toolbar component  */
const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out,
    width 0.15s ease-out, height 0.15s ease-out;
  border-top: none;
  z-index: 1000;

  div > header {
    position: sticky;
    display: flex;
    margin: -1rem;
    padding: 1rem;
    top: 0;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    background-color: ${colors.colorizedBackgroundColor};

    h3 {
      margin: 0;
      padding-right: 2rem;
    }
  }

  div > section {
    padding-top: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    ul {
      padding-left: 0;
      margin: 0;
      list-style: none;

      li {
        margin-bottom: 1rem;
        > header {
          display: flex;
          flex-direction: row;
          margin-bottom: 0.25rem;
          > svg {
            width: 1rem;
            margin-top: 0.125rem;
            margin-right: 0.5rem;
          }
          div.caption {
            flex: 1;
          }
        }

        p,
        small,
        figcaption {
          color: ${colors.primaryColorBrighter};
          font-size: 1rem;
        }

        p {
          font-weight: 600;
          margin-bottom: 0.25rem;
          margin-top: 0.5rem;
        }

        .photo-examples {
          padding: 0;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-evenly;

          figure {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0.25rem;

            figcaption {
              margin: 0.5rem;
            }
          }

          .placeholder-image {
            width: 10rem;
            max-width: 25vw;
            background-color: #eee;
          }
        }
      }
    }
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 8px -8px 0 -8px;

    label.link-button {
      text-align: center;
    }
  }

  .file-label {
    position: relative;

    &:focus-within {
      box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
      transition: box-shadow 0.2s;
    }

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
`

function CheckmarkItem({
  caption,
  children,
}: {
  caption: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="with-checkmark">
      <header>
        <StyledCheckmarkIcon color={colors.linkColor} />
        <div className="caption">{caption}</div>
      </header>
      {children}
    </li>
  )
}

export default class PhotoUploadInstructionsToolbar extends React.Component<
  Props,
  State
> {
  props: Props

  state: State = {
    guidelinesAccepted: false,
  }

  fileInput: null | HTMLInputElement

  checkBox: null | HTMLInputElement

  backLink: null | HTMLButtonElement

  goButton: null | React.ElementRef<'button'>

  onFileInputChanged = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const { files } = input

    if (!files || files.length === 0) {
      if (this.props.onClose) {
        this.props.onClose()
      }
    } else if (this.props.onCompleted) {
      this.props.onCompleted(files)
    }
  }

  onClose = (event: React.SyntheticEvent) => {
    if (this.props.onClose) {
      this.props.onClose()
      event.preventDefault()
    }
  }

  render() {
    const { waitingForPhotoUpload } = this.props
    const canSubmit = !waitingForPhotoUpload

    const captions = {
      header: t`The following images…`,
      content: t`...give useful information on accessibility.`,
      copyright: t`...were taken by me.`,
      people: t`...do not show any identifiable persons.`,
      copyrightDetail: t`I hereby publish these images into the public domain and renounce copyright protection (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0 1.0 Universal license</a>).`,
    }

    return (
      <FocusTrap>
        <div>
          <StyledToolbar
            className="photoupload-instructions-toolbar"
            hidden={false}
            isSwipeable={false}
            isModal
          >
            <header>
              <h3>{captions.header}</h3>
              <CloseButton onClick={this.onClose} />
            </header>
            <section>
              <ul>
                <CheckmarkItem caption={captions.content}>
                  <section className="photo-examples">
                    <figure>
                      <img
                        src="/images/photo-upload/entrancePlaceholder.png"
                        className="placeholder-image entrance-image"
                        aria-label=""
                      />
                      <figcaption>{t`Entrances`}</figcaption>
                    </figure>
                    <figure>
                      <img
                        src="/images/photo-upload/sitemapPlaceholder.png"
                        className="placeholder-image sitemap-image"
                        aria-label=""
                      />
                      <figcaption>{t`Site map`}</figcaption>
                    </figure>
                    <figure>
                      <img
                        src="/images/photo-upload/toiletPlaceholder.png"
                        className="placeholder-image toilet-image"
                        aria-label=""
                      />
                      <figcaption>{t`toilets`}</figcaption>
                    </figure>
                  </section>
                </CheckmarkItem>

                <CheckmarkItem caption={captions.copyright}>
                  <small
                    dangerouslySetInnerHTML={{
                      __html: captions.copyrightDetail,
                    }}
                  />
                </CheckmarkItem>
                <CheckmarkItem caption={captions.people} />
              </ul>
            </section>
            <footer>
              <button
                className="link-button negative-button"
                onClick={this.onClose}
              >
                {t`Cancel`}
              </button>
              <label
                className="link-button primary-button file-label"
                htmlFor="photo-file-upload"
              >
                {t`Continue`}
                {waitingForPhotoUpload && <Spinner />}
                <input
                  ref={(input) => {
                    this.fileInput = input
                  }}
                  type="file"
                  id="photo-file-upload"
                  multiple={false}
                  accept="image/*"
                  onChange={this.onFileInputChanged}
                  disabled={!canSubmit}
                  name="continue-upload"
                  className="hidden-file-input"
                />
              </label>
            </footer>
          </StyledToolbar>
        </div>
      </FocusTrap>
    )
  }
}
