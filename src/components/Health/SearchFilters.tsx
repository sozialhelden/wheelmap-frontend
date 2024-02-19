import React from "react";
import { t } from "ttag";
import { WindowContextType, useWindowContext } from "../../lib/context/WindowContext";
import ActiveFilters from "./ActiveFilters";
import FilterInputs from "./FilterInputs";
import { MockFacility } from "./mocks";
import { StyledH2, StyledSearchFilterContainer, StyledSearchFilterDetails, StyledSearchFilterSection } from "./styles";

type Props = {
  mockFacilities: MockFacility[];
  labels: string[];
};

function FilterSection({ mockFacilities, labels }: Props) {
  const { width }: WindowContextType = useWindowContext();

  const [isMobile, setMobile] = React.useState(width < 640);
  const [isDesktop, setDesktop] = React.useState(width >= 640);

  React.useEffect(() => {
    setMobile(width < 640);
    setDesktop(width >= 640);
  }, [width]);

  const renderFilterContainer = () => {
    return (
      <StyledSearchFilterContainer>
        <div>
          <FilterInputs mockedFacilities={mockFacilities} />
        </div>
      </StyledSearchFilterContainer>
    );
  };

  return (
    <StyledSearchFilterSection>
      <StyledH2>{t`Suchfilter`}</StyledH2>
      <ActiveFilters />
      {isDesktop && renderFilterContainer()}
      {isMobile && (
        <StyledSearchFilterDetails>
          <summary>{t`Filteroptionen ausklappens`}</summary>
          {renderFilterContainer()}
        </StyledSearchFilterDetails>
      )}
    </StyledSearchFilterSection>
  );
}

export default FilterSection;
