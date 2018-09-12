// @flow
import * as React from 'react';
import strings from './strings';
import { generateOsmEditUrl, generateOsmNoteUrl } from '../../../lib/generateOsmUrls';
import type { Feature } from '../../../lib/Feature';

type Props = {
  feature: Feature,
  featureId: number,
  onClose: (event: UIEvent) => void,
};

export default class ReportProblemButton extends React.Component<Props> {
  howToLink: ?HTMLElement;
  editLink: ?HTMLElement;
  noteLink: ?HTMLElement;
  backButton: ?HTMLElement;

  componentDidMount() {
    this.editLink && this.editLink.focus();
  }

  trapFocus = ({ nativeEvent }: { nativeEvent: Event }) => {
    if (
      nativeEvent.target === this.howToLink &&
      nativeEvent.key === 'Tab' &&
      nativeEvent.shiftKey
    ) {
      nativeEvent.preventDefault();
      this.editLink && this.editLink.focus();
    }
    if (
      nativeEvent.target === this.editLink &&
      nativeEvent.key === 'Tab' &&
      !nativeEvent.shiftKey
    ) {
      nativeEvent.preventDefault();
      this.noteLink && this.noteLink.focus();
    }
    if (
      nativeEvent.target === this.noteLink &&
      nativeEvent.key === 'Tab' &&
      !nativeEvent.shiftKey
    ) {
      nativeEvent.preventDefault();
      this.backButton && this.backButton.focus();
    }
    if (
      nativeEvent.target === this.backButton &&
      nativeEvent.key === 'Tab' &&
      !nativeEvent.shiftKey
    ) {
      nativeEvent.preventDefault();
      this.howToLink && this.howToLink.focus();
    }
  };

  render() {
    if (!this.props.featureId) return null;

    const editUrl = generateOsmEditUrl(this.props.featureId);
    const noteUrl = generateOsmNoteUrl(this.props.feature);

    const {
      osmRemoveHint,
      osmPermanentlyClosedHint,
      osmPermanentlyClosedHowtoLinkCaption,
      osmLoginHint,
      editButtonCaption,
      noteButtonCaption,
      backButtonCaption,
    } = strings();

    return (
      <section
        role="dialog"
        aria-labelledby="osm-remove-hint osm-permanently-closed-hint osm-login-hint"
      >
        <p id="osm-remove-hint">{osmRemoveHint}</p>
        <p id="osm-permanently-closed-hint">
          {osmPermanentlyClosedHint} (
          <a
            href="https://wiki.openstreetmap.org/wiki/Key:disused:"
            ref={howToLink => (this.howToLink = howToLink)}
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
          ref={editLink => (this.editLink = editLink)}
          onKeyDown={this.trapFocus}
        >
          {editButtonCaption}
        </a>
        <a
          href={noteUrl}
          className="link-button"
          ref={noteLink => (this.noteLink = noteLink)}
          onKeyDown={this.trapFocus}
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
