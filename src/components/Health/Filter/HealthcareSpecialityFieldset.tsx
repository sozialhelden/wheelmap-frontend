import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import { StyledLabel, StyledSelect, StyledSubLabel } from "../styles";

export function HealthcareSpecialityFieldset({ healthcareSpecialityTagStats, route, handleInputChange, translatedSpecialityOptions }: { healthcareSpecialityTagStats; route; handleInputChange: (event: any) => void; translatedSpecialityOptions: any; }) {
  return <fieldset>
    <StyledLabel htmlFor="healthcare:speciality-select" $fontBold="bold">
      <T _str="Speciality" />
    </StyledLabel>
    {healthcareSpecialityTagStats.error && (
      <Callout intent="danger" icon="error">
        <T _str={`Could not load healthcare specialities.`} />
      </Callout>
    )}
    {!healthcareSpecialityTagStats.error && (
      <StyledSelect value={route.query["healthcare:speciality"]} name="healthcare:speciality" id="healthcare:speciality-select" onChange={handleInputChange}>
        <option value="">
          <T _str="All categories" />
        </option>
        {translatedSpecialityOptions?.map(
          (item, index) => (route.query.show_untranslated_tags === "1" || item.healthcareTranslated !== undefined) && (
            <option key={item["healthcare:speciality"] + index} value={item["healthcare:speciality"]}>
              {`${item.healthcareTranslated || item["healthcare:speciality"]}`} {item.count ? `(${item.count})` : ""}
            </option>
          )
        )}
      </StyledSelect>
    )}
    <StyledSubLabel>
      <T _str="Select one of the items in the list." />
    </StyledSubLabel>
  </fieldset>;
}
