import * as React from 'react';
import styled from 'styled-components';

import { Feature } from '../../../lib/Feature';
import { Category } from '../../../lib/Categories';

import ShareButtons from './ShareButtons';
import PhoneNumberLink from './PhoneNumberLink';
import ExternalLinks from './ExternalLinks';
import PlaceAddress from './PlaceAddress';
import colors from '../../../lib/colors';
import PlaceWebsiteLink from './PlaceWebsiteLink';
import ReportIssueButton from './ReportIssueButton';
import { UAResult } from '../../../lib/userAgent';

type Props = {
  feature: Feature | null,
  featureId: string | number | null,
  category: Category | null,
  parentCategory: Category | null,
  className?: string,
  equipmentInfoId: string | null,
  userAgent: UAResult,
  onToggle?: () => void
};

function UnstyledIconButtonList(props: Props): JSX.Element {
  return (
    <div className={props.className}>
      <PlaceAddress {...props} />
      <PhoneNumberLink {...props} />
      <ExternalLinks {...props} />
      <PlaceWebsiteLink {...props} />
      <ShareButtons {...props} />
      {!props.equipmentInfoId && <ReportIssueButton {...props} />}
    </div>
  );
}

const IconButtonList = styled(UnstyledIconButtonList)`
  .link-button,
  .expand-button {
    svg {
      margin-left: 0.3rem;
      margin-right: 0.7rem;
    }
  }

  .link-button {
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      min-width: 1.5rem;

      g,
      rect,
      circle,
      path {
        fill: ${colors.tonedDownSelectedColor};
      }
    }

    &:not(:hover) {
      color: ${colors.textColorTonedDown};
    }
  }
`;

export default IconButtonList;
