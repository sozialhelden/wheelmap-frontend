// @flow
import * as React from 'react';

type Props = {
  featureId: number,
};

export default function ReportProblemButton({ featureId }: Props) {
  if (!featureId) return null;

  const url = `https://www.openstreetmap.org/edit?node=${featureId}`;

  return (<section>
    <p>Wheelmap uses data from OpenStreetMap to display places.</p>
    <p>Did you know you can change this place’s information on OpenStreetMap directly?</p>
    <p className="subtle">(Note that you need to log in first to do this, and that it can take a while until the place is updated on Wheelmap.)</p>
    <a href={url} className="link-button">
      Edit this place on OpenStreetMap
    </a>
  </section>);
}
