// @flow

import React from 'react';
import styled from 'styled-components';
import colors from '../../lib/colors';
import a11yIcons from './a11yIcons';

type Props = {
  className?: string,
  details: any,
};

// This should also render the AccessibilityDetailsTree as linear styled component
const AccessibilityDetails = ({ className, details }: Props) => {
  const a11yIconsStructure = a11yIcons(details);

  return (
    <div className={className}>
      {Object.keys(a11yIconsStructure).map(sectionName => (
        <>
          <h3>{sectionName}</h3>
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
    </div>
  );
};

export default styled(AccessibilityDetails)`
  max-width: 600px;
  margin-top: 3rem;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  color: ${colors.textColorBrighter};

  h2 {
    margin-bottom: 2rem;
    font-size: 1.25rem;
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
    svg {
      margin-bottom: 1rem;
      path {
        fill: ${colors.textColorBrighter};
      }
    }

    @media (min-width: 512px) {
      flex-basis: 33%;
    }

    @media (min-width: 769px) {
      flex-basis: 25%;
    }
  }
`;
