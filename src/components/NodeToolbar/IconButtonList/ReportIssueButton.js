// @flow

import { t } from 'c-3po';
import * as React from 'react';
import FlagIcon from '../../icons/actions/Flag';
import type { Feature } from '../../../lib/Feature';


// translator: Button caption shown in the PoI details panel
const caption = t`Report an issue`;


type Props = {
  equipmentInfoId: ?string,
  feature: ?Feature,
};


export default function ReportIssueButton(props: Props) {
  return <button
    className="link-button full-width-button"
    onClick={() => {
      if (typeof props.onOpenReportMode === 'function') props.onOpenReportMode();
    }}
  >
    <FlagIcon />
    <span>{caption}</span>
  </button>;
}