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
  margin-inline-start: 0;
}


label {
  user-select: none;
}



label input[role="switch"] {
  opacity: 0;
  // position: relative;
  
}

label input[role="switch"] ~ .state {
  display: inline-block;
  // user-select: none;
}

label input[role="switch"] ~ .state > .container {
  position: relative;
  top: 2px;
  display: inline-block;
  border: 1px solid black;
  opacity: 0.6;
  width: 40px;
  height: 15px;
  left: -1.5rem;
  border-radius: 11px;
}

label input[role="switch"] ~ .state > .container > .position {
  position: relative;
  top: 0px;
  left: 3px;
  display: inline-block;
  border-radius: 9px;
  width: 14px;
  height: 14px;
  background: black;
  
}

label input[role="switch"]:not(:checked) ~ .state span.on {
  display: none;
}

label input[role="switch"]:checked ~ .state > span.off {
  display: none;
}

label input[role="switch"]:checked ~ .state > .container > .position {
  left: 25px;
  border-color: green;
  background: green;
  opacity: 1;
}

// // label.focus,
// // label:hover {
// //   padding: 2px 2px 4px 4px;
// //   border-width: 2px;
// //   outline: none;
// //   background-color: #def;
// //   cursor: pointer;
// // }

// // label.focus span.container,
// // label:hover span.container {
// //   background-color: white;
// // }


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