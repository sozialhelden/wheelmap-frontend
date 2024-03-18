import React from "react";
import { t } from "ttag";
import SozialheldInnenLogo from "../MapLegacy/SozialheldInnenLogo";
import { FilterContext, FilterContextType, getFilterOptionsInput } from "./FilterContext";
import FilterInputs from "./FilterInputs";
import { FilterOptions } from "./helpers";
import { StyledH2, StyledMainContainerColumn, StyledSecionsContainer } from "./styles";

function SearchFilters() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptionsFC: FilterOptions = getFilterOptionsInput(fc);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(filterOptionsFC);
  const [headerOptions, setHeaderOptions] = React.useState<any>({
    loadingSpinner: true,
    text: t`Arztpraxis Suche`,
  });

  return (
    <StyledMainContainerColumn>
      <StyledH2>{headerOptions.text}</StyledH2>
      <SozialheldInnenLogo />
      <StyledSecionsContainer>
        <FilterInputs />
      </StyledSecionsContainer>
    </StyledMainContainerColumn>
  );
}

export default SearchFilters;
