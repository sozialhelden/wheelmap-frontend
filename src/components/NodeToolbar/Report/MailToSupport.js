// @flow
import * as React from 'react';
import type { Feature } from '../../../lib/Feature';
import { getCategoryId, type Category } from '../../../lib/Categories';
import strings from './strings';

type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: ?Category,
  parentCategory: ?Category,
  onClose: (event: UIEvent) => void,
};

export default class MailToSupport extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.trapFocus = this.trapFocus.bind(this);
  }

  componentDidMount() {
    this.mailLink.focus();
  }

  trapFocus({ nativeEvent }) {
    if (nativeEvent.target === this.mailLink && nativeEvent.key === 'Tab' && nativeEvent.shiftKey) {
      nativeEvent.preventDefault();
      this.backButton.focus();
    }
    if (
      nativeEvent.target === this.backButton &&
      nativeEvent.key === 'Tab' &&
      !nativeEvent.shiftKey
    ) {
      nativeEvent.preventDefault();
      this.mailLink.focus();
    }
  }

  render() {
    const { feature, featureId } = this.props;

    if (!featureId || !feature || !feature.properties) return null;

    const url = `https://wheelmap.org/nodes/${featureId}`;
    const properties = feature.properties;
    const categoryOrParentCategory = this.props.category || this.props.parentCategory;
    const categoryName = categoryOrParentCategory ? getCategoryId(categoryOrParentCategory) : null;

    const {
      reportBody,
      reportSubject,
      apologyAndSolution,
      contactButtonCaption,
      backButtonCaption,
    } = strings();

    const subject = reportSubject(properties.name, categoryName);
    const body = reportBody(url);
    const reportMailToLink = `mailto:bugs@wheelmap.org?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    return (
      <section role="dialog" aria-labelledby="apology-and-solution">
        <p id="apology-and-solution">{apologyAndSolution}</p>
        <a
          href={reportMailToLink}
          className="link-button"
          ref={mailLink => (this.mailLink = mailLink)}
          onKeyDown={this.trapFocus}
        >
          {contactButtonCaption}
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
