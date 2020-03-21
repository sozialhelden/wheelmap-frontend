// @flow

import React from 'react';
import humanizeString from 'humanize-string';
import styled from 'styled-components';
import colors from '../../lib/colors';

import Icon from '../icons/categories/accommodation';

const fakeData = {
  entrances: {
    automaticDoor: true,
    rampWith4PercentSlope: true,
  },
  restrooms: {
    wheelchairAccessibleToilet: true,
  },
  allergies: {
    carpets: true,
    cats: true,
  },
  communications: {
    website: true,
    internet: false,
  },
};

type Props = {
  className?: string,
  criteria: {},
};

function formatName(name: string, properties: {}): string {
  const string = properties[`${name}Localized`] || humanizeString(name);
  return string.replace(/^Rating /, '');
}

function capitalizeFirstLetter(string): string {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}

const AccessibiltyCriteria = ({ className, criteria }: Props) => {
  return (
    <div className={className}>
      {Object.keys(fakeData).map(rootCriterion => {
        return (
          <div>
            <h2>{humanizeString(rootCriterion)}</h2>
            <ul>
              {Object.keys(fakeData[rootCriterion]).map(subCriterion => {
                if (fakeData[rootCriterion][subCriterion]) {
                  return (
                    <li>
                      <Icon width="2rem" height="2rem" />
                      {humanizeString(subCriterion)}
                    </li>
                  );
                } else {
                  return <li>NO{humanizeString(subCriterion)}</li>;
                }
              })}
            </ul>
          </div>
        );
      })}
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
