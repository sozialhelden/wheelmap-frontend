import React from "react";
import { StyledButton } from "../styles";
import { FilterContext } from "./FilterContext";

type Props = {
  key: string;
  name: string;
};

function ActivePreferenceButton({ key, name }: Props) {
  const filterContext = React.useContext(FilterContext);
  const filterMap = filterContext.filterMap;

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextMap = new Map(filterMap);
      nextMap.set(name, false);
      filterContext.setFilterMap(nextMap);
    },
    [filterContext, filterMap, name]
  );

  return (
    <li key={key}>
      <StyledButton value={name} className="active-filter-button" onClick={handleClick}>
        {name}
      </StyledButton>
    </li>
  );
}

export default ActivePreferenceButton;
