import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { MockFacility } from "..";
import {
  WindowContextType,
  useWindowContext,
} from "../../../lib/context/WindowContext";
import { StyledLegend } from "../styles";
import ActiveFilters from "./ActiveFilters";
import ActivePreferenceSwitch from "./ActivePreferenceSwitch";
import FilterInputs from "./FilterInputs";

export const StyledFilterPreferencesSection = styled.section`
  --switch-height: calc(2rem - 8px);

  .label {
    height: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  fieldset {
    width: fit-content;
    border: none;
  }

  legend {
    font-size: 110%;
    margin-bottom: 0.5rem;
  }

  .label {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: auto;
  }

  li {
    list-style-type: none;
  }

  ul {
    padding-inline-start: 0;
  }

  label {
    user-select: none;
  }

  label input[role="switch"]:not(:checked) ~ .state span.on {
    display: none;
  }

  label input[role="switch"]:checked ~ .state > span.off {
    display: none;
  }
`;

type Props = {
  mockFacilities: MockFacility[];
  labels: string[];
};

function FilterSection({ mockFacilities, labels }: Props) {
  const { width }: WindowContextType = useWindowContext();

  const [isMobile, setMobile] = React.useState(width < 640);
  const [isDesktop, setDesktop] = React.useState(width >= 640);

  React.useEffect(() => {
    setMobile(width < 640);
    setDesktop(width >= 640);
  }, [width]);

  const renderFilterContainer = () => {
    return (
      <div className="search-filter-container">
        <div className="input-choices">
          <FilterInputs mockedFacilities={mockFacilities} />
        </div>
        <div className="preference-choices">
          <StyledFilterPreferencesSection>
            <fieldset>
              <StyledLegend>{t`Präferenzen`}</StyledLegend>
              <ul>
                {labels.map((label) => {
                  return (
                    <ActivePreferenceSwitch key={label + `-key`} name={label} />
                  );
                })}
              </ul>
            </fieldset>
          </StyledFilterPreferencesSection>
        </div>
      </div>
    );
  };

  return (
    <section className="search-filter-section">
      <h2 className="search-filter-h2">{t`Suchfilter`}</h2>
      <ActiveFilters />
      {renderFilterContainer()}
      {/* {isDesktop && renderFilterContainer()}
      {isMobile && (
        <details className="search-filter-details">
          <summary className="search-filter-summary">{t`Filteroptionen ausklappen`}</summary>
          {renderFilterContainer()}
        </details>
      )} */}
    </section>
  );
}

export default FilterSection;
