// @flow

import * as React from 'react';
import styled from 'styled-components';

import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';

import ShareButtons from './ShareButtons';
import PhoneNumberLink from './PhoneNumberLink';
import ExternalLinks from './ExternalLinks';
import PlaceAddress from './PlaceAddress';
import colors from '../../../lib/colors';
import PlaceWebsiteLink from './PlaceWebsiteLink';
import ReportIssueButton from './ReportIssueButton';

type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  category: ?Category,
  parentCategory: ?Category,
  className?: string,
  equipmentInfoId: ?string,
};

function UnstyledIconButtonList(props: Props) {
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
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 -8px;

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
