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
  background: linear-gradient(to top, grey, lightgrey);
  border-radius: 2rem;
  transform: scale(0.85);
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
}

.label {
  display: flex;
  // grid-template-columns: 1fr 2fr;
  flex-direction: row;
  gap: 1rem;
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


function PreferencesFilter() {
  const labels = ["Aufzug", "EbenerdigerEingang", "Parkplatz", "LeichteSprache", "Gebärdensprache"];

  return (
    <PrefFilterSection>
      <fieldset>  
        <legend>{t`Präferenzen`}</legend>
        <ul> {labels.map((label) => {return (
          <li key={label + `-key`}>
            <label className="label">
                <input type="checkbox" role="switch" className="checkbox-switch" name={label} id={label} />
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

export default PreferencesFilter;