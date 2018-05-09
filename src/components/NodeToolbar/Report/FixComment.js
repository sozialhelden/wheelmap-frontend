// @flow
import * as React from 'react';
import strings from './strings';
import generateOsmEditUrl from './generateOsmEditUrl';

type Props = {
  featureId: number,
  onClose: (() => void),
};

export default class ReportProblemButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.trapFocus = this.trapFocus.bind(this);
  }

  componentDidMount() {
    this.editLink.focus();
  }

  trapFocus({nativeEvent}) {
    if (nativeEvent.target === this.editLink && nativeEvent.key === 'Tab' && nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.backButton.focus();
    }
    if (nativeEvent.target === this.backButton && nativeEvent.key === 'Tab' && !nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.editLink.focus();
    }
  }

  render() {
    if (!this.props.featureId) return null;

    const url = generateOsmEditUrl(this.props.featureId);

    const { osmHint, osmEditHint, osmLoginHint, editButtonCaption, backButtonCaption } = strings();

    return (
      <section
        role="dialog"
        aria-labelledby="osm-hint osm-edit-hint osm-login-hint"
      >
        <p id="osm-hint">{osmHint}</p>
        <p id="osm-edit-hint">{osmEditHint}</p>
        <p className="subtle" id="osm-login-hint">{osmLoginHint}</p>
        <a
          href={url}
          className="link-button"
          ref={editLink => this.editLink = editLink}
          onKeyDown={this.trapFocus}
        >
          {editButtonCaption}
        </a>
        <button
          className="link-button negative-button"
          onClick={this.props.onClose}
          ref={backButton => this.backButton = backButton}
          onKeyDown={this.trapFocus}
        >
          {backButtonCaption}
        </button>
      </section>
    );
  }
}
