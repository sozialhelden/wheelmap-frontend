// @flow
import React from 'react';
import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';

type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: ?Category,
  parentCategory: ?Category,
};

export default function ReportProblemButton(props: Props) {
  const { feature, featureId } = props;

  if (!featureId || !feature || !feature.properties) return null;

  const url = `https://wheelmap.org/nodes/${featureId}`;
  const properties = feature.properties;
  const categoryOrParentCategory = props.category || props.parentCategory;
  const categoryName = categoryOrParentCategory ? categoryOrParentCategory._id : null;
  const placeName = properties.name || (categoryName && `${categoryName} on Wheelmap`) || 'This place is on Wheelmap';
  const reportSubject = `[Wheelmap] Problem with ${placeName}`;
  const reportBody = `(Please only write in English or German.)\n\nHi Sozialhelden,\n\nsomething is wrong with this place: ${url}\n\nThe problem is:\n\n`;
  const reportMailToLink = `mailto:bugs@wheelmap.org?subject=${encodeURIComponent(reportSubject)}&body=${encodeURIComponent(reportBody)}`;

  return (<section>
    <p>Sorry for that! Just drop us a line so we can help you to fix the issue.</p>
    <a href={reportMailToLink} className="link-button">
      Contact the Wheelmap support team
    </a>
  </section>);
}
