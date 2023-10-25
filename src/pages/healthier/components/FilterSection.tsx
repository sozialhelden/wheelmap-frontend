import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { MockFacility } from "..";
import { WindowContextType, useWindowContext } from "../../../lib/context/WindowContext";
import ActivePreferenceButton from "./ActivePreferenceButton";
import FilterInputs from "./FilterInputs";
import PreferenceSwitch from "./PreferenceSwitch";

export const StyledFilterPreferencesSection = styled.section`

.label {
  height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.checkbox-switch {
  opacity: 1;
  height:  calc(2rem - 4px);
  width: calc(3rem + 6px);
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
  height: calc(2rem - 4px);
  width: calc(2rem - 4px);
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  background: linear-gradient(to bottom, grey, lightgrey);
  border-radius: 2rem;
  transform: scale(0.6);
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

  /* create a map of refs */
  const buttonRefsMap = new Map(labels.map((label) => [label, React.createRef<HTMLButtonElement>()]));
  const switchRefsMap = new Map(labels.map((label) => [label, React.createRef<HTMLInputElement>()]));
  console.log(switchRefsMap.keys());
  //React.ChangeEvent<HTMLInputElement>

  React.useEffect(() => {
    setMobile(width < 640);
    setDesktop(width >= 640);
  },[width]);


  const handleActivePreferenceButtonCLick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const activeButton = e.target as HTMLButtonElement;
    const buttonRef = buttonRefsMap.get(activeButton.name);
    const checkboxRef = switchRefsMap.get(activeButton.name);
    buttonRef.current?.classList.remove("active-filter-button");
    buttonRef.current?.classList.add("disabled-filter-button");
    checkboxRef.current.checked = false;
  }

  const handleSwitchClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const activeSwitch = e.target as HTMLInputElement;
    const switchName: string = activeSwitch.name;
    const buttonRef = buttonRefsMap.get(switchName);
    const checkboxRef = switchRefsMap.get(switchName);
    const checked = checkboxRef.current.checked;
    const unChecked = !checked;
    
    if(checked) {
      buttonRef.current?.classList.add("active-filter-button");
      buttonRef.current?.classList.remove("disabled-filter-button");
    }
    if(unChecked) {
      buttonRef.current?.classList.remove("active-filter-button");
      buttonRef.current?.classList.add("disabled-filter-button");
    }

    checkboxRef.current.checked = !checked;  
  }

  const renderActiveFilters = (filterLabels: string[], handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void) => {
    return (
      <ul className="active-filters-bar" aria-label={t`Aktive Filter`} >
        {filterLabels.map(label => 
          <li key={label}>
            <ActivePreferenceButton
              ref={buttonRefsMap.get(label)}
              className={activeStyle} 
              name={label}
              onClick={handleClick}
            />
          </li>
        )}
      </ul>);
  }

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
                    <PreferenceSwitch 
                      ref={switchRefsMap.get(label)}
                      label={label} 
                      onClick={handleSwitchClick}
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
      <section className="search-filter-section">
        <h2 className="search-filter-h2">{t`Suchfilter`}</h2>      
          {renderActiveFilters(labels, handleActivePreferenceButtonCLick)}
          {isDesktop && renderFilterContainer() }
          {isMobile && 
            <details className="search-filter-details">
              <summary className="search-filter-summary">{t`Filteroptionen ausklappen`}</summary>
              {renderFilterContainer()}
            </details>
          }
    </section>
  );
}

export default FilterSection;
