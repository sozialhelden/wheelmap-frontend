import React from "react";
import { FilterContext } from "./FilterContext";

type Props = {
  name: string;
}

function ActivePreferenceSwitch({name}: Props) {
  
  const filterContext = React.useContext(FilterContext); 
  const filterMap = filterContext.filterMap;

  const handleChange =  React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMap = new Map(filterMap); 
    // nextMap.set(name, !filterMap.get(name));
    nextMap.set(name, e.target.checked);
    filterContext.setFilterMap(nextMap);
  }
  , [filterContext, filterMap, name]);

  return (
    <input 
      type="checkbox" 
      role="switch" 
      className="checkbox-switch" 
      name={name} 
      onChange={handleChange}
      id={name} 
      value={name || ''}
      checked={filterMap.get(name) || false} // set default value to false b/c of uncontrolled component
    />
  )
}

export default ActivePreferenceSwitch;
