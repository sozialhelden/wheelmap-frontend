import styled from "styled-components";
import { t } from "ttag";

export const PrefFilterSection = styled.section`
fieldset {
  width: fit-content;
}

legend {
  font-size: 110%;
}

.label {
  display: grid;
  grid-template-columns: [preference-label-start] minmax(5rem, 9rem) [switch-start] max-content [state-start] max-content [preference-label-end];
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

label input[role="switch"] {
  opacity: 0;  
}

label input[role="switch"] ~ .state {
  display: inline-block;
}

label input[role="switch"] ~ .state > .container {
  position: relative;
  display: flex;
  justify-content: center;
  top: 0em;
  display: inline-block;
  border: 1px solid black;
  opacity: 0.6;
  width: calc(2em + 4px);
  height: calc(1em + 4px);
  left: -1.25rem;
  border-radius: 1em;
}

label input[role="switch"] ~ .state > .container > .position {
  position: relative;
  left: 2px;
  display: inline-block;
  border-radius: 0.5em;
  width: calc(1em - 2px);
  height: calc(1em - 2px);
  background: black;
  
}

label input[role="switch"]:not(:checked) ~ .state span.on {
  display: none;
}

label input[role="switch"]:checked ~ .state > span.off {
  display: none;
}

label input[role="switch"]:checked ~ .state > .container > .position {
  left: 1.1em;
  border-color: green;
  background: green;
  opacity: 1;
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
                {label} 
                <input type="checkbox" role="switch" name={label} id={label} />
                <span className="state">
                  <span className="container">
                    <span className="position"> </span>
                  </span>
                  <span className="on" aria-hidden="true">On</span>
                  <span className="off" aria-hidden="true">Off</span>
                </span>
            </label>
          </li>
        );})}
        </ul>
      </fieldset>
    </PrefFilterSection>
  );
}

export default PreferencesFilter;