// @flow

import React from 'react';
import styled from 'styled-components';
import colors from '../../lib/colors';
import a11yIcons from './a11yIcons';

// import checkmark from './checkmark.svg';
// import cross from './cross.svg';
// import accessibilityCategoryIcon from './accessibility-category-icon.svg';

type Props = {
  className?: string,
  criteria: any,
};

const AccessibiltyCriteria = ({ className, criteria }: Props) => {
  const a11yIconsStructure = a11yIcons(criteria);

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

export default styled(AccessibiltyCriteria)`
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
    margin-bottom: 2rem;
    padding: 0;
  }

  li {
    list-style: none;
    display: flex;
    width: 120px;
    flex-direction: column;
    align-items: center;
    margin-right: 2rem;
    text-align: center;
    svg {
      margin-bottom: 1rem;
      path {
        fill: ${colors.textColorBrighter};
      }
    }
  }
`;
