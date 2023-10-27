import React from "react";
import { t } from "ttag";
import ActivePreferenceButton from "./ActivePreferenceButton";
import { FilterContext, getFilterLabels } from "./FilterContext";

function ActiveFilters() {
  const filterContext = React.useContext(FilterContext);
  const filterMap = filterContext.filterMap;
  const labels = React.useMemo(() => getFilterLabels(filterContext).filter(label => filterMap.get(label)), [filterMap, filterContext]);

  return (
    <ul className="active-filters-bar" aria-label={t`Aktive Filter`} >
      {labels.map(label => 
        <li key={label}>
          <ActivePreferenceButton
            name={label}
          />
        </li>
      )}
    </ul>);
}

export default ActiveFilters;