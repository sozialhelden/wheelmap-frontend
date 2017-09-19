// @flow
import * as React from 'react';
import strings from './strings';

type Props = {
  featureId: number,
  onClose: (() => void),
};

export default function ReportProblemButton(props: Props) {
  if (!props.featureId) return null;

  const url = `https://www.openstreetmap.org/edit?node=${props.featureId}`;

  const { osmPositionHint, osmLoginHint, editButtonCaption, backButtonCaption } = strings;

  return (<section>
    <p>{osmPositionHint}</p>
    <p className="subtle">{osmLoginHint}</p>
    <a href={url} className="link-button">{editButtonCaption}</a>
    <button className="link-button negative-button" onClick={props.onClose}>
      {backButtonCaption}
    </button>
  </section>);
}
