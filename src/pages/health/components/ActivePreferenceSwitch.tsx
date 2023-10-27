import React from "react";
import { FilterContext } from "./FilterContext";

type Props = {
  name: string;
}

function ActivePreferenceSwitch({name}: Props) {
  
  const filterContext = React.useContext(FilterContext); 
  const filterMap = filterContext.filterMap;

  const handleClick =  React.useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const nextMap = new Map(filterMap); 
    nextMap.set(name, !filterMap.get(name));
    filterContext.setFilterMap(nextMap);
  }
  , [filterContext, filterMap, name]);

  return (
    <input 
      type="checkbox" 
      role="switch" 
      className="checkbox-switch" 
      name={name} 
      onClick={handleClick}
      id={name} 
      value={name}
      checked={filterMap.get(name)}
    />
  )
}

export default ActivePreferenceSwitch;
