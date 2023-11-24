import React from "react";
import { StyledCheckbox } from "../styles";
import { FilterContext } from "./FilterContext";

type Props = {
  key: string;
  name: string;
};

function ActivePreferenceSwitch({ key, name }: Props) {
  const filterContext = React.useContext(FilterContext);
  const filterMap = filterContext.filterMap;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextMap = new Map(filterMap);
      // nextMap.set(name, !filterMap.get(name));
      nextMap.set(name, e.target.checked);
      filterContext.setFilterMap(nextMap);
    },
    [filterContext, filterMap, name]
  );

  return (
    <li key={key}>
    <label className="label">
      <StyledCheckbox
        type="checkbox"
        role="switch"
        name={name}
        onChange={handleChange}
        id={name}
        value={name || ""}
        checked={filterMap.get(name) || false} // set default value to false b/c of uncontrolled component
      />
      {name}
    </label>
    </li>
  );
}

export default ActivePreferenceSwitch;
