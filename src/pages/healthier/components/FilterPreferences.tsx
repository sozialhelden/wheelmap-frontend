import styled from "styled-components";
import { t } from "ttag";

export const PrefFilterSection = styled.section`

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
  labels: string[];
  filterButton?: React.RefObject<HTMLButtonElement>;
}

function FilterPreferences({ labels }: Props) {

  // a clickhandler for the checkbox-switches
  // when the checkbox is checked, the label is added to the active filters bar
  // when the checkbox is unchecked, the label is removed from the active filters bar
  // the checkbox-switches and the filter buttons are connected via the label, they have the same name

  const handleCheckboxSwitchClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const clickedCheckbox = e.target as HTMLInputElement;
    const clickedCheckboxName: string = clickedCheckbox.name;

    if(clickedCheckbox.checked === true) {
      const buttons = document.querySelectorAll(".disabled-filter-button");
      buttons.forEach((button: HTMLButtonElement) => {
        if(button.name === clickedCheckboxName) {
          button.classList.add("active-filter-button");
          button.classList.remove("disabled-filter-button");
        }
      });  
    }
    if(clickedCheckbox.checked === false) {
      const buttons = document.querySelectorAll(".active-filter-button");
      buttons.forEach((button: HTMLButtonElement) => {
        if(button.name === clickedCheckboxName) {
          button.classList.remove("active-filter-button");
          button.classList.add("disabled-filter-button");
        }
      });  
    }
    
  }

  return (
    <PrefFilterSection>
      <fieldset>  
        <legend>{t`Präferenzen`}</legend>
        <ul> {labels.map((label) => {return (
          <li key={label + `-key`}>
            <label className="label">
                <input 
                  type="checkbox" 
                  role="switch" 
                  className="checkbox-switch" 
                  name={label} 
                  onClick={handleCheckboxSwitchClick}
                  id={label} 
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
    </PrefFilterSection>
  );
}

export default FilterPreferences;