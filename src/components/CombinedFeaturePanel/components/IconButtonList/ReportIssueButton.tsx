import { t } from 'ttag';

import { PlaceInfo } from '@sozialhelden/a11yjson';
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature';
import Flag from '../../../icons/actions/Flag';

type Props = {
  equipmentInfoId: string | null;
  feature: PlaceInfo | AnyFeature | null;
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
      <Flag />
      <span>{caption}</span>
    </button>
  );
}
