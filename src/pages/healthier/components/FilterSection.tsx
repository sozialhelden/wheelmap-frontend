import React from "react";
import { t } from "ttag";
import { MockFacility } from "..";
import { WindowContextType, useWindowContext } from "../../../lib/context/WindowContext";
import FilterInputs from "./FilterInputs";
import FilterPreferences from "./FilterPreferences";

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

  const buttonRefs = labels.map(() => React.createRef<HTMLButtonElement>());

 console.log(buttonRefs);

  React.useEffect(() => {
    setMobile(width < 640);
    setDesktop(width >= 640);
  },[width]);


  const handleActiveFilterButtonCLick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const clickedButton = e.target as HTMLButtonElement;
    const clickedButtonName: string = clickedButton.name;
    const buttons = document.querySelectorAll(".active-filter-button");
    buttons.forEach((button: HTMLButtonElement) => {
      if(button.name === clickedButtonName) {
        button.classList.remove("active-filter-button");
        button.classList.add("disabled-filter-button");
        const checkbox = document.querySelector(`input[name="${clickedButtonName}"]`) as HTMLInputElement;
        checkbox.checked = false;
      }
    });
  }
  const renderActiveFilters = (filterLabels: string[], handleButtonCLick: (e: React.MouseEvent<HTMLButtonElement>) => void) => {
    return (
      <ul className="active-filters-bar" aria-label={t`Aktive Filter`} >
        { filterLabels.map(label => 
          <li key={label}>
            <button
              className={activeStyle} 
              name={label}
              onClick={handleButtonCLick}
              >{label}</button>
          </li>
          ) }
      </ul>);
  }

  const renderFilterContainer = () => {
    return (
      <div className="search-filter-container">
        <div className="input-choices">
          <FilterInputs data={mockedHealthcareFacilities} />
        </div>
        <div className="preference-choices">
          <FilterPreferences labels={labels} />  
        </div>          
      </div>
    );
   }
   

  return (
      <section className="search-filter-section">
        <h2 className="search-filter-h2">{t`Suchfilter`}</h2>      
          {renderActiveFilters(labels, handleActiveFilterButtonCLick)}
        { isDesktop && renderFilterContainer() }
        { isMobile && 
          <details className="search-filter-details">
            <summary className="search-filter-summary">{t`Filteroptionen ausklappen`}</summary>
              {renderFilterContainer()}
          </details>
        }
    </section>
  );
}

export default FilterSection;
