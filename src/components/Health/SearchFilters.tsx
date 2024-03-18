import React from "react";
import { t } from "ttag";
import IncluscienceLogo from "../MapLegacy/IncluscienceLogo";
import SozialheldInnenLogo from "../MapLegacy/SozialheldInnenLogo";
import { FilterContext, FilterContextType, getFilterOptionsInput } from "./FilterContext";
import FilterInputs from "./FilterInputs";
import { FilterOptions } from "./helpers";
import { StyledColors, StyledH2, StyledH5, StyledHDivider, StyledMainContainerColumn, StyledSecionsContainer } from "./styles";

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
      <IncluscienceLogo />
      <StyledHDivider $space={0.1} />
      <StyledH2>{headerOptions.text}</StyledH2>
      <StyledH5 $fontBold={true}>{t`Barrierefreie Praxen finden - einfach und überall.`}</StyledH5>
      <StyledHDivider $colored={StyledColors.silver} />
      <StyledSecionsContainer>
        <FilterInputs />
      </StyledSecionsContainer>
      <StyledHDivider />
      <SozialheldInnenLogo />
      <StyledH5>{t`Ein Projekt der Sozialheld*innen.`}</StyledH5>
      <StyledHDivider $colored={StyledColors.silver} />
      <StyledH5>{t`© OpenStreetMap contributors`}</StyledH5>
    </StyledMainContainerColumn>
  );
}

export default SearchFilters;
