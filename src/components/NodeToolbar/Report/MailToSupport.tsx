import * as React from 'react';
import { Feature } from '../../../lib/Feature';
import { getCategoryId, Category } from '../../../lib/Categories';
import strings from './strings';

type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: Category | null,
  parentCategory: Category | null,
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
};

export default class MailToSupport extends React.Component<Props> {
  protected mailLink = React.createRef<HTMLAnchorElement>()
  protected backButton = React.createRef<HTMLButtonElement>()

  constructor(props: Props) {
    super(props);

    this.trapFocus = this.trapFocus.bind(this);
  }

  componentDidMount() {
    if (this.mailLink.current) {
      this.mailLink.current.focus();
    }
  }

  trapFocus({ nativeEvent }) {
    if (nativeEvent.target === this.mailLink && nativeEvent.key === 'Tab' && nativeEvent.shiftKey) {
      nativeEvent.preventDefault();

      if (this.backButton.current) {
        this.backButton.current.focus();
      }
    }
    if (
      nativeEvent.target === this.backButton &&
      nativeEvent.key === 'Tab' &&
      !nativeEvent.shiftKey
    ) {
      nativeEvent.preventDefault();

      if (this.mailLink.current) {
        this.mailLink.current.focus();
      }
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
          ref={this.mailLink}
          onKeyDown={this.trapFocus}
        >
          {contactButtonCaption}
        </a>
        <button
          className="link-button negative-button"
          onClick={this.props.onClose}
          ref={this.backButton}
          onKeyDown={this.trapFocus}
        >
          {backButtonCaption}
        </button>
      </section>
    );
  }
}
