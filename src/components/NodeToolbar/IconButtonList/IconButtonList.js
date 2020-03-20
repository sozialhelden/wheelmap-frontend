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
import { ChromelessButton } from '../../Button';

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
    margin: 0 -10px;
    padding: 10px;
    border: none;
    outline: none;
    border-radius: 4px;
    font-size: 16px;
    text-decoration: none;
    cursor: pointer;
    background-color: transparent;
    color: ${colors.linkColor};

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        background-color: ${colors.linkBackgroundColorTransparent};
      }
    }

    &:focus&:not(.primary-button) {
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    &:disabled {
      opacity: 0.15;
    }

    &:not(:hover) {
      color: ${colors.textColorTonedDown};
    }

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
  }

  .link-button {
  }

  ${ChromelessButton}.expand-button {
    margin: 0 -10px;
    padding: 8px 10px;
    display: flex;
    justify-content: left;
    width: 100%;

    &.focus-visible {
      background-color: transparent;
    }

    &:hover {
      color: ${colors.linkColor};
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: #89939e;
    }
  }
`;

export default IconButtonList;
