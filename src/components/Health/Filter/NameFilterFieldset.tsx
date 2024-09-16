import { T } from "@transifex/react";
import { StyledBigTextInput, StyledLabel, StyledSubLabel } from "../styles";

export function NameFilterFieldset({ route, onChange: onChangeNameFilter }: { route; onChange: (event: any) => void; }) {
  return <fieldset>
    <StyledLabel htmlFor="name-search" $fontBold="bold">
      <T _str="Name" />
    </StyledLabel>
    <StyledBigTextInput type="text" value={route.query.name} name="name" id="name-search" onChange={onChangeNameFilter} />
    <StyledSubLabel>
      <T _str="Search for a specific name." />
    </StyledSubLabel>
  </fieldset>;
}
