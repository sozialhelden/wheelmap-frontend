import React from "react";
import { FilterContext } from "./FilterContext";
import { StyledCheckbox } from "./styles";

type Props = {
  name: string;
};

function ActivePreferenceSwitch({ name }: Props) {
  const filterContext = React.useContext(FilterContext);
  const filterMap = filterContext.filterMap;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextMap = new Map(filterMap);
      nextMap.set(name, e.target.checked);
      filterContext.setFilterMap(nextMap);
    },
    [filterContext, filterMap, name]
  );

  return (
    <li>
      <label className="label">
        <StyledCheckbox
          type="checkbox"
          role="switch"
          name={name}
          onChange={handleChange}
          id={name}
          value={name || ""}
          checked={filterMap.get(name) || false}
        />
        {name}
      </label>
    </li>
  );
}

export default ActivePreferenceSwitch;
