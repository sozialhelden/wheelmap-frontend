import { T, useT } from "@transifex/react";
import AppFooter from "./AppFooter";
import FilterInputs from "./FilterInputs";
import { StyledClaim, StyledColors, StyledH1, StyledHDivider, StyledMainContainerColumn } from "./styles";


function SearchFilterDialog(props: any) {
  const t = useT();

  return (
    <StyledMainContainerColumn>
      <StyledH1 $fontBold>
        <T _str="Find accessible health sites" />
        <StyledClaim>
          <T _str="- easily and everywhere." />
        </StyledClaim>
      </StyledH1>
      <StyledHDivider $colored={StyledColors.silver} />
      <FilterInputs />
      <div style={{ flex: 1 }} />
      <AppFooter />
    </StyledMainContainerColumn>
  );
}

export default SearchFilterDialog;
