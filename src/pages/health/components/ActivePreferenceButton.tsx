import React from "react";
import { StyledButton } from "../styles";
import { FilterContext } from "./FilterContext";

type Props = {
  name: string;
}

function ActivePreferenceButton({name}: Props) {
  const filterContext = React.useContext(FilterContext); 
  const filterMap = filterContext.filterMap;
  
  const handleClick =  React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const nextMap = new Map(filterMap); 
    nextMap.set(name, false);
    filterContext.setFilterMap(nextMap);
  }
  , [filterContext,filterMap, name]);

  return (
    <StyledButton value={name} className="active-filter-button" onClick={handleClick}>{name}</StyledButton>
  )
}

export default ActivePreferenceButton;