import styled from 'styled-components';

import { Category } from '../../../lib/Categories';
import { Feature } from '../../../lib/Feature';

import colors from '../../../lib/colors';
import { UAResult } from '../../../lib/userAgent';
import ExternalLinks from './ExternalLinks';
import PhoneNumberLink from './PhoneNumberLink';
import PlaceAddress from './PlaceAddress';
import PlaceWebsiteLink from './PlaceWebsiteLink';
import ReportIssueButton from './ReportIssueButton';

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

export const StyledIconButtonList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 -8px;

  .link-button,
  .expand-button {
    > svg {
      margin-left: 0.3rem;
      margin-right: 0.7rem;
    }
  }

  .link-button {
    display: flex;
    flex-direction: row;
    align-items: center;

    > svg {
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


function IconButtonList(props: Props): JSX.Element {
  return (
    <StyledIconButtonList className={props.className}>
      <PlaceAddress {...props} />
      <PhoneNumberLink {...props} />
      <ExternalLinks {...props} />
      <PlaceWebsiteLink {...props} />
      {!props.equipmentInfoId && <ReportIssueButton {...props} />}
    </StyledIconButtonList>
  );
}

export default IconButtonList;
