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
    <p>You can remove non-existing places on OpenStreetMap.</p>
    <p>If the place closed permanently, you can tag the place as ‘disused’ on OpenStreetMap (See <a href="https://wiki.openstreetmap.org/wiki/Key:disused:">this Wiki article</a> for more information).</p>
    <p className="subtle">(Note that you need to log in first to do this, and that it can take a while until the place is updated on Wheelmap.)</p>
    <a href={url} className="link-button">
      Edit this place on OpenStreetMap
    </a>
    <button className="link-button negative-button" onClick={props.onClose}>Back</button>
  </section>);
}
