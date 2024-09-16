import { T } from "@transifex/react";
import Link from "next/link";
import ChevronLeft from "../ShareBar/icons/ChevronLeft";
import AppFooter from "./AppFooter";
import FilterInputs from "./Filter/FilterInputs";
import { StyledClaim, StyledH1, StyledMainContainerColumn } from "./styles";

function SearchFilterDialog(props: any) {
  return (
    <StyledMainContainerColumn>
      <Link href="https://wheelmap.org/" rel="noopener noreferrer">
        <ChevronLeft width={12.5} height={12.5} style={{ marginRight: 5 }} />
        <T _str="Wheelmap" />
      </Link>
      <StyledH1>
        <a href="/" style={{ color: "inherit" }}>
          <T _str="Find accessible health sites" />
        </a>
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
