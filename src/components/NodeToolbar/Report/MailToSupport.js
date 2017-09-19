// @flow
import * as React from 'react';
import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import strings from './strings';


type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: ?Category,
  parentCategory: ?Category,
  onClose: (() => void),
};


export default function ReportProblemButton(props: Props) {
  const { feature, featureId } = props;

  if (!featureId || !feature || !feature.properties) return null;

  const url = `https://wheelmap.org/nodes/${featureId}`;
  const properties = feature.properties;
  const categoryOrParentCategory = props.category || props.parentCategory;
  const categoryName = categoryOrParentCategory ? categoryOrParentCategory._id : null;

  const {
    reportBody,
    reportSubject,
    apologyAndSolution,
    contactButtonCaption,
    backButtonCaption,
  } = strings;

  const subject = reportSubject(properties.name, categoryName);
  const body = reportBody(url);
  const reportMailToLink = `mailto:bugs@wheelmap.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (<section>
    <p>{apologyAndSolution}</p>
    <a href={reportMailToLink} className="link-button">{contactButtonCaption}</a>
    <button className="link-button negative-button" onClick={props.onClose}>{backButtonCaption}</button>
  </section>);
}
