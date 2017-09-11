// @flow
import React from 'react';

type Props = {
  featureId: number,
};

export default function ReportProblemButton({ featureId }: Props) {
  if (!featureId) return null;

  const url = `https://www.openstreetmap.org/edit?node=${featureId}`;

  return (<section>
    <p>You can change this place’s position on OpenStreetMap.</p>
    <p className="subtle">(Note that you need to log in first to do this, and that it can take a while until the place is updated on Wheelmap.)</p>
    <a href={url} className="link-button">
      Edit this place on OpenStreetMap
    </a>
  </section>);
}
