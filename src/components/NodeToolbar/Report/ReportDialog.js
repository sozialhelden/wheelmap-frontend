// @flow
import React from 'react';
import styled from 'styled-components';
import {
  isWheelmapFeatureId,
} from '../../../lib/Feature';
import type { Feature } from '../../../lib/Feature';

import FixOnExternalPage from './FixOnExternalPage';
import IssueSelector from './IssueSelector';


type Props = {
  feature: Feature,
  featureId: string | number | null,
  className: string,
  onClose: (() => void),
};


function ReportProblemDialog(props: Props) {
  const { feature, featureId } = props;

  if (!featureId || !feature || !feature.properties) return null;

  return (<section className={props.className}>
    {isWheelmapFeatureId(featureId) ?
      (<IssueSelector feature={feature} featureId={featureId} />) :
      <FixOnExternalPage properties={feature.properties} />}

    <button className="link-button negative-button" onClick={props.onClose}>
      Back
    </button>
  </section>);
}


const StyledReportProblemDialog = styled(ReportProblemDialog)`
  > header {
    margin: 1em 0;
    font-weight: bold;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;

export default StyledReportProblemDialog;
