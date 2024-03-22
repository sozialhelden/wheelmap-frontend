import React from "react";
import { jt, t } from "ttag";
import { FilterContext, FilterContextType, useFilterOptionsUrlInput } from "./FilterContext";
import FilterInputs from "./FilterInputs";
import { FilterOptions } from "./helpers";
import { StyledColors, StyledFooter, StyledH2, StyledHDivider, StyledIncluscienceLogo, StyledMainContainerColumn, StyledSectionsContainer, StyledSozialheldInnenLogo } from "./styles";

function SearchFilters() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptionsFC: FilterOptions = useFilterOptionsUrlInput(fc);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(filterOptionsFC);
  const [headerOptions, setHeaderOptions] = React.useState<any>({
    loadingSpinner: true,
    text: t`Find health sites`,
  });

  const incluScienceLink = <a href="https://incluscience.org" target="_blank" rel="noreferrer noopener">
    <StyledIncluscienceLogo />
  </a>;

  const sozialheldenLink = <a href="https://sozialhelden.de" target="_blank" rel="noreferrer noopener">
    <StyledSozialheldInnenLogo />
  </a>;

  const openStreetMapLink = <a href="https://openstreetmap.org" target="_blank" rel="noreferrer noopener">
    OpenStreetMap
  </a>;

  return (
    <StyledMainContainerColumn>
      <StyledHDivider $space={0.1} />
      <StyledH2 $fontBold>{headerOptions.text}</StyledH2>
      <StyledHDivider $colored={StyledColors.silver} />
      <StyledSectionsContainer>
        <FilterInputs />
      </StyledSectionsContainer>

      <div style={{ flex: 1 }} />

      <StyledFooter>
        <p>{jt`Powered by ${incluScienceLink}.`}</p>
        <p>{jt`A project by ${sozialheldenLink}.`}</p>
        <p>{jt`© ${openStreetMapLink} contributors.`}</p>
      </StyledFooter>
    </StyledMainContainerColumn>
  );
}

export default SearchFilters;
