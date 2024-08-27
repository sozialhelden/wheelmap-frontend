import { PlaceInfo } from '@sozialhelden/a11yjson'
import * as React from 'react'
import {
  generateOsmEditUrl,
  generateOsmNoteUrl,
} from '../../../lib/model/osm/generateOsmUrls'
import strings from './strings'

type Props = {
  feature: PlaceInfo;
  featureId: number;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default class FixOsmNonExistingPlace extends React.Component<Props> {
  howToLink: HTMLElement | null

  editLink: HTMLElement | null

  noteLink: HTMLElement | null

  backButton: HTMLElement | null

  componentDidMount() {
    this.editLink && this.editLink.focus()
  }

  trapFocus = (event: React.KeyboardEvent<{}>) => {
    if (
      event.target === this.howToLink
      && event.key === 'Tab'
      && event.shiftKey
    ) {
      event.preventDefault()
      this.editLink && this.editLink.focus()
    }
    if (
      event.target === this.editLink
      && event.key === 'Tab'
      && !event.shiftKey
    ) {
      event.preventDefault()
      this.noteLink && this.noteLink.focus()
    }
    if (
      event.target === this.noteLink
      && event.key === 'Tab'
      && !event.shiftKey
    ) {
      event.preventDefault()
      this.backButton && this.backButton.focus()
    }
    if (
      event.target === this.backButton
      && event.key === 'Tab'
      && !event.shiftKey
    ) {
      event.preventDefault()
      this.howToLink && this.howToLink.focus()
    }
  }

  render() {
    if (!this.props.featureId) return null

    const editUrl = generateOsmEditUrl(this.props.featureId)
    const noteUrl = generateOsmNoteUrl(this.props.feature)

    const {
      osmRemoveHint,
      osmPermanentlyClosedHint,
      osmPermanentlyClosedHowtoLinkCaption,
      osmLoginHint,
      editButtonCaption,
      noteButtonCaption,
      backButtonCaption,
    } = strings()

    return (
      <section
        role="dialog"
        aria-labelledby="osm-remove-hint osm-permanently-closed-hint osm-login-hint"
      >
        <p id="osm-remove-hint">{osmRemoveHint}</p>
        <p id="osm-permanently-closed-hint">
          {osmPermanentlyClosedHint}
          {' '}
          (
          <a
            href="https://wiki.openstreetmap.org/wiki/Key:disused:"
            ref={(howToLink) => (this.howToLink = howToLink)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {osmPermanentlyClosedHowtoLinkCaption}
          </a>
          )
        </p>
        <p className="subtle" id="osm-login-hint">
          {osmLoginHint}
        </p>
        <a
          href={editUrl}
          className="link-button"
          ref={(editLink) => (this.editLink = editLink)}
          onKeyDown={this.trapFocus}
          target="_blank"
          rel="noopener noreferrer"
        >
          {editButtonCaption}
        </a>
        <a
          href={noteUrl}
          className="link-button"
          ref={(noteLink) => (this.noteLink = noteLink)}
          onKeyDown={this.trapFocus}
          target="_blank"
          rel="noopener noreferrer"
        >
          {noteButtonCaption}
        </a>
        <button
          className="link-button negative-button"
          onClick={this.props.onClose}
          ref={(backButton) => (this.backButton = backButton)}
          onKeyDown={this.trapFocus}
        >
          {backButtonCaption}
        </button>
      </section>
    )
  }
}
