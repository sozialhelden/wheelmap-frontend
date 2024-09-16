import { T } from "@transifex/react";
import { StyledLabel, StyledRadio, StyledRadioBox } from "../styles";

type Props = {
  hasNameFilter: boolean;
  onChangeFilterType: (event: any) => void;
};

export function ByNameOrTypeChoiceFieldset(
  { hasNameFilter, onChangeFilterType }: Props,
) {
  return (
    <StyledRadioBox style={{ flexDirection: "row", alignItems: "center" }}>
      <StyledLabel $fontBold="bold" htmlFor="search-name">
        <T _str="Search by" />
      </StyledLabel>
      <label htmlFor="search-name">
        <StyledRadio
          type="radio"
          name="search"
          id="search-name"
          value="name"
          checked={hasNameFilter}
          onChange={onChangeFilterType}
        />
        <T _str="Name" />
      </label>
      <label htmlFor="search-healthcare">
        <StyledRadio
          type="radio"
          name="search"
          id="search-healthcare"
          value="healthcare"
          checked={!hasNameFilter}
          onChange={onChangeFilterType}
        />
        <T _str="Type" />
      </label>
    </StyledRadioBox>
  );
}
