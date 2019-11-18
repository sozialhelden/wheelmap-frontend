import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import MapPinWithPlusIcon from '../icons/ui-elements/MapPinWithPlusIcon';
import BellIcon from '../icons/ui-elements/BellIcon';
import { UserIcon } from '../icons/ui-elements/index';

type Props = {
  mappedPlacesCount: number,
  participantCount: number,
  endDate: Date | null,
  className?: string,
};

const Statistics = ({ mappedPlacesCount, participantCount, endDate, className }: Props) => {
  // translator: Screenreader description for the statistics/numbers part of a mapping event
  const statisticsRegionAriaLabel = t`Mapping Event Numbers`;
  // translator: Description for number of already mapped places in the mapping event
  const mappedPlacesLabel = t`Mapped Places`;
  // translator: Description for number of people invited to the current mapping event
  const inviteesCountAriaLabel = t`Participants`;
  // translator: Description for number of days left in the mapping event
  const daysLeftLabel = t`Days Left`;

  const currentDate = new Date();
  const remainingDaysLeft =
    endDate && endDate > currentDate
      // @ts-ignore
      ? Math.ceil((endDate - currentDate) / 1000 / 60 / 60 / 24)
      : null;

  return (
    <section className={className} aria-label={statisticsRegionAriaLabel}>
      <div className="statistic">
        <div className="statistic-count">
          <MapPinWithPlusIcon />
          <span>{mappedPlacesCount}</span>
        </div>
        <div className="statistic-description">{mappedPlacesLabel}</div>
      </div>
      <div className="statistic">
        <div className="statistic-count">
          <UserIcon />
          <span>{participantCount}</span>
        </div>
        <div className="statistic-description">{inviteesCountAriaLabel}</div>
      </div>
      {remainingDaysLeft && (
        <div className="statistic">
          <div className="statistic-count">
            <BellIcon />
            <span>{remainingDaysLeft}</span>
          </div>
          <div className="statistic-description">{daysLeftLabel}</div>
        </div>
      )}
    </section>
  );
};

const StyledStatistics = styled(Statistics)`
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-bottom: 20px;

  svg {
    margin-right: 10px;
  }

  .statistic {
    width: 100%;
  }

  .statistic-count {
    font-size: 27px;
    font-weight: 300;
    color: #37404d;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .statistic-description {
    font-size: 14px;
    color: #22262d;
  }
`;

export default StyledStatistics;
