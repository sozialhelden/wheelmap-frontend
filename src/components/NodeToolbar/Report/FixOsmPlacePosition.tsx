import * as React from 'react';
import strings from './strings';
import { generateOsmEditUrl, generateOsmNoteUrl } from '../../../lib/generateOsmUrls';
import { Feature } from '../../../lib/Feature';

type Props = {
  feature: Feature,
  featureId: number,
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
};

export default class FixOsmPlacePosition extends React.Component<Props> {
  editLink: HTMLElement | null;
  noteLink: HTMLElement | null;
  backButton: HTMLElement | null;

  componentDidMount() {
    this.editLink && this.editLink.focus();
  }

  trapFocus = (event: React.KeyboardEvent<{}>) => {
    if (event.target === this.editLink && event.key === 'Tab' && event.shiftKey) {
      event.preventDefault();
      this.noteLink && this.noteLink.focus();
    }
    if (event.target === this.noteLink && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      this.backButton && this.backButton.focus();
    }
    if (event.target === this.backButton && event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      this.editLink && this.editLink.focus();
    }
  };

  render() {
    if (!this.props.featureId) return null;

    const editUrl = generateOsmEditUrl(this.props.featureId);
    const noteUrl = generateOsmNoteUrl(this.props.feature);

    const {
      osmPositionHint,
      osmLoginHint,
      editButtonCaption,
      noteButtonCaption,
      backButtonCaption,
    } = strings();

    return (
      <section role="dialog" aria-labelledby="osm-position-hint osm-login-hint">
        <p id="osm-position-hint">{osmPositionHint}</p>
        <p className="subtle" id="osm-login-hint">
          {osmLoginHint}
        </p>
        <a
          href={editUrl}
          className="link-button"
          ref={editLink => (this.editLink = editLink)}
          onKeyDown={this.trapFocus}
          target="_blank"
          rel="noopener noreferrer"
        >
          {editButtonCaption}
        </a>
        <a
          href={noteUrl}
          className="link-button"
          ref={noteLink => (this.noteLink = noteLink)}
          onKeyDown={this.trapFocus}
          target="_blank"
          rel="noopener noreferrer"
        >
          {noteButtonCaption}
        </a>
        <button
          className="link-button negative-button"
          onClick={this.props.onClose}
          ref={backButton => (this.backButton = backButton)}
          onKeyDown={this.trapFocus}
        >
          {backButtonCaption}
        </button>
      </section>
    );
  }
}
