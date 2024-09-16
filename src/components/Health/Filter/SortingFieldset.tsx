import { T } from "@transifex/react";
import { StyledLabel, StyledSelect } from "../styles";

export function SortingFieldset({ route, handleInputChange, cityName }: { route; handleInputChange: (event: any) => void; cityName: string | string[]; }) {
  return <fieldset>
    <StyledLabel htmlFor="sort-select" $fontBold="bold">
      <T _str="Sort results" />
    </StyledLabel>
    <StyledSelect defaultValue={route.query.sort} name="sort" id="sort-select" onChange={handleInputChange}>
      <option value="alphabetically">
        <T _str="Alphabetically" />
      </option>
      <option value="distance">
        <T _str="By distance from me" />
      </option>
      <option value="distanceFromCity">
        <T _str="By distance from {cityName} center" cityName={cityName} />
      </option>
    </StyledSelect>
  </fieldset>;
}
