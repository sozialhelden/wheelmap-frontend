import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { MockFacility } from "..";
import { WindowContextType, useWindowContext } from "../../../lib/context/WindowContext";
import ActiveFilters from "./ActiveFilters";
import ActivePreferenceSwitch from "./ActivePreferenceSwitch";
import { FilterContext } from "./FilterContext";
import FilterInputs from "./FilterInputs";

export const StyledFilterPreferencesSection = styled.section`
  --switch-height: calc(2rem - 8px);

  .label {
    height: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .checkbox-switch {
    opacity: 1;
    height: var(--switch-height);
    width: calc(3rem + 2px);
    appearance: inherit;
    background-color: #f6f7f9;
    border-radius: 2rem;
    box-shadow: inset 0 0.5px 1px rgba(0,0,0,0.2),
                inset 0 0.5px 1px rgba(0,0,0,0.2),
                inset 0 -0.5px 1px rgba(0,0,0,0.2); 
    transition: 0.2s;
    position: relative;
    outline: none;
    cursor: pointer;
  } 

  .checkbox-switch::before {
    height: var(--switch-height);
    width: var(--switch-height);
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background: linear-gradient(to bottom, grey, lightgrey);
    border-radius: 2rem;
    transform: scale(0.75);
    transition: 0.2s;
    box-shadow: 0 0.5px 0.5px rgba(0,0,0,0.5),
                inset 0.5px 0.5px rgba(255,255,255,0.2),
                inset -0.5px 0.5px rgba(255,255,255,0.2);
  }

  .checkbox-switch:not(focus):focus-visible {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
    transition: 0s;
  }

  .checkbox-switch:checked {
    background-color: #fff;
    box-shadow: inset 0 0.2px 1px rgba(0,0,0, 0.2),
                inset 0 0.2px 1px rgba(0,0,0, 0.2),
                inset 0 -0.2px 1px rgba(0,0,0, 0.2);
  }

  .checkbox-switch:checked::before  {
    left: calc(2rem - 6px);
    background: linear-gradient(to top, green, lightgreen);
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
  data: MockFacility[];
  labels: string[];
}

function FilterSection ({data, labels}: Props) {
  const mockedHealthcareFacilities = data;
  
  const { width }: WindowContextType = useWindowContext();
  
  const [isMobile, setMobile] = React.useState(width < 640);
  const [isDesktop, setDesktop] = React.useState(width >= 640);
  const [activeStyle, setStyle] = React.useState("disabled-filter-button");
  const [filterMap, setFilterMap] = React.useState<Map<string, boolean>>(new Map<string, boolean>());

  const memoizedFilterContext = React.useMemo(() => ({filterMap, setFilterMap}), [filterMap, setFilterMap]);

  React.useEffect(() => {
    setMobile(width < 640);
    setDesktop(width >= 640);
  },[width]);

  const renderFilterContainer = () => {
    return (

      <div className="search-filter-container">
        <div className="input-choices">
          <FilterInputs data={mockedHealthcareFacilities} />
        </div>
        <div className="preference-choices">
          <StyledFilterPreferencesSection>
            <fieldset>  
              <legend>{t`Präferenzen`}</legend>
              <ul> {labels.map((label) => {return (
                <li key={label + `-key`}>
                  <label className="label">
                    <ActivePreferenceSwitch 
                      name={label} 
                    />
                    <span className="state">
                      {/* <span className="on" aria-hidden="true">On</span>
                      <span className="off" aria-hidden="true">Off</span> */}
                    </span>
                    {label} 
                  </label>
                </li>
              );})}
              </ul>
            </fieldset>
          </StyledFilterPreferencesSection>
        </div>          
      </div>
    );
   }
   

  return (
    <FilterContext.Provider value={memoizedFilterContext}>
      <section className="search-filter-section">
          <h2 className="search-filter-h2">{t`Suchfilter`}</h2>      
          <ActiveFilters />
          {isDesktop && renderFilterContainer() }
          {isMobile && 
            <details className="search-filter-details">
              <summary className="search-filter-summary">{t`Filteroptionen ausklappen`}</summary>
              {renderFilterContainer()}
            </details>
          }
      </section>
    </FilterContext.Provider>
  );
}

export default FilterSection;
