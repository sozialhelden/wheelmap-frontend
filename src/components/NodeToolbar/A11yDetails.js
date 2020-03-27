// @flow

import React from 'react';
import styled from 'styled-components';
import omit from 'lodash/omit';

import colors from '../../lib/colors';
import a11yIcons, { filterOutDetailsWithIconSupport } from './a11yIcons';
import AccessibilityDetailsTree from './AccessibilitySection/AccessibilityDetailsTree';

type Props = {
  className?: string,
  details: any,
};

// This should also render the AccessibilityDetailsTree as linear styled component
const A11yDetails = ({ className, details }: Props) => {
  const a11yIconsStructure = a11yIcons(details);
  const detailsWithoutIconSupport = filterOutDetailsWithIconSupport(details);

  return (
    <div className={className}>
      {Object.keys(a11yIconsStructure).map(sectionName => (
        <>
          <h2>{sectionName}</h2>
          <ul>
            {a11yIconsStructure[sectionName].map(a11yIcon => (
              <li>
                <img src={a11yIcon.iconUrl} alt="" />
                <p>{a11yIcon.caption}</p>
              </li>
            ))}
          </ul>
        </>
      ))}
      <AccessibilityDetailsTree details={detailsWithoutIconSupport} />
    </div>
  );
};

export default styled(A11yDetails)`
  max-width: 600px;
  margin-top: 3rem;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  color: ${colors.textColorBrighter};

  h2 {
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
  }

  li {
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-basis: 50%;
    text-align: center;
    img {
      width: 50px;
      height: 50px;
    }

    @media (min-width: 512px) {
      flex-basis: 33%;
    }

    @media (min-width: 769px) {
      flex-basis: 25%;
    }
  }

  ${AccessibilityDetailsTree} {
    color: ${colors.textColorBrighter};

    dt {
      float: none;
    }

    li {
      text-align: left;
    }

    .ac-list {
      color: ${colors.textColorBrighter};
    }
  }
`;
