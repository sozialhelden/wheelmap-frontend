import React from "react";
import { t } from "ttag";
import ActivePreferenceButton from "./ActivePreferenceButton";
import { FilterContext, getFilterLabels } from "./FilterContext";
import { StyledActiveFilterBar } from "./styles";

function ActiveFilters() {
  const filterContext = React.useContext(FilterContext);
  const filterMap = filterContext.filterMap;
  const labels = React.useMemo(() => getFilterLabels(filterContext).filter((label) => filterMap.get(label)), [filterMap, filterContext]);

  return (
    <StyledActiveFilterBar aria-label={t`Aktive Filter`}>
      {labels.map((label, index) => (
        <ActivePreferenceButton key={index.toString()} name={label} />
      ))}
    </StyledActiveFilterBar>
  );
}

export default ActiveFilters;
