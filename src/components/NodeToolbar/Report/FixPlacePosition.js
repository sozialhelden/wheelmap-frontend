// @flow
import * as React from 'react';

type Props = {
  featureId: number,
  onClose: (() => void),
};

export default function ReportProblemButton(props: Props) {
  if (!props.featureId) return null;

  const url = `https://www.openstreetmap.org/edit?node=${props.featureId}`;

  return (<section>
    <p>You can change this place’s position on OpenStreetMap.</p>
    <p className="subtle">(Note that you need to log in first to do this, and that it can take a while until the place is updated on Wheelmap.)</p>
    <a href={url} className="link-button">
      Edit this place on OpenStreetMap
    </a>
    <button className="link-button negative-button" onClick={props.onClose}>Back</button>
  </section>);
}
