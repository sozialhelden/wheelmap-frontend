import { t } from 'ttag';
import * as React from 'react';
import FlagIcon from '../../icons/actions/Flag';
import { PlaceInfo } from '@sozialhelden/a11yjson';

type Props = {
  equipmentInfoId: string | null;
  feature: PlaceInfo | null;
  onOpenReportMode?: () => void;
};

export default function ReportIssueButton(props: Props) {
  // translator: Button caption shown in the PoI details panel
  const caption = t`Report a problem`;
  return (
    <button
      className="link-button full-width-button"
      onClick={() => {
        if (typeof props.onOpenReportMode === 'function') {
          props.onOpenReportMode();
        }
      }}
    >
      <FlagIcon />
      <span>{caption}</span>
    </button>
  );
}
