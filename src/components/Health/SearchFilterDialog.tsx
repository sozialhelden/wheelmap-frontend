import { T, useT } from "@transifex/react";
import AppFooter from "./AppFooter";
import FilterInputs from "./FilterInputs";
import { StyledClaim, StyledH1, StyledMainContainerColumn } from "./styles";


function SearchFilterDialog(props: any) {
  const t = useT();

  return (
    <StyledMainContainerColumn>
      <StyledH1>
        <a href="/" style={{ color: 'inherit' }}><T _str="Find accessible health sites" /></a>
        <StyledClaim>
          <T _str="- easily and everywhere." />
        </StyledClaim>
      </StyledH1>
      <FilterInputs />
      <div style={{ flex: 1 }} />
      <AppFooter />
    </StyledMainContainerColumn>
  );
}

export default SearchFilterDialog;
