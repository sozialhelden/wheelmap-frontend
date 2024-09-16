import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import AccessibilityFilterButton from "../../shared/AccessibilityFilterButton";
import { StyledCheckbox, StyledHDivider, StyledLabel, StyledRadioBox, StyledWheelchairFilter } from "../styles";

export function AccessibilityFilterFieldset({ wheelchairTagStats, route, getWheelchairCount, hasToiletInfoFilter, onChangeFilterType: handleFilterType, hasBlindFilter, hasDeafFilter }: { wheelchairTagStats; route; getWheelchairCount: (wheelchair: any) => any; hasToiletInfoFilter: boolean; onChangeFilterType: (event: any) => void; hasBlindFilter: boolean; hasDeafFilter: boolean; }) {
  return <fieldset>
    <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">
      <T _str="Wheelchair accessibility" />
    </StyledLabel>
    <StyledWheelchairFilter>
      {wheelchairTagStats.error && (
        <Callout intent="warning" icon="warning-sign">
          <T _str={`Could not load statistics by accessibility.`} />
        </Callout>
      )}
      {route.query.wheelchair === undefined ? <AccessibilityFilterButton accessibilityFilter={[]} showUnfilteredAccessibilityAsAllIcons={true} count={getWheelchairCount("")} caption={<T _str="Show all places" />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} /> : null}
      {route.query.wheelchair === undefined || route.query.wheelchair === "yes" ? <AccessibilityFilterButton accessibilityFilter={["yes"]} count={getWheelchairCount("yes")} caption={<T _str={"Only fully wheelchair-accessible"} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={route.query.wheelchair === "yes"} /> : null}
      {route.query.wheelchair === undefined || (route.query.wheelchair && route.query.wheelchair.includes("limited")) ? <AccessibilityFilterButton accessibilityFilter={["yes", "limited"]} count={getWheelchairCount("limitedyes")} caption={<T _str={`Partially wheelchair-accessible`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair && route.query.wheelchair.includes("limited")} showCloseButton={route.query.wheelchair && route.query.wheelchair.includes("limited")} /> : null}
      {route.query.wheelchair === undefined || route.query.wheelchair === "no" ? <AccessibilityFilterButton accessibilityFilter={["no"]} count={getWheelchairCount("no")} caption={<T _str={`Only places that are not accessible`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={route.query.wheelchair === "no"} /> : null}
      {route.query.wheelchair === undefined || route.query.wheelchair === "unknown" ? <AccessibilityFilterButton accessibilityFilter={["unknown"]} count={getWheelchairCount("unknown")} caption={<T _str={`Places that I can contribute information to`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={route.query.wheelchair === "unknown"} /> : null}
    </StyledWheelchairFilter>
    <StyledHDivider $space={10} />
    <StyledRadioBox style={{ flexDirection: "column", alignItems: "start" }}>
      <StyledLabel $fontBold="bold" htmlFor="filter-blind">
        <T _str="Show only places with…" />
      </StyledLabel>
      <label htmlFor="filter-toilets">
        <StyledCheckbox type="checkbox" name="filter" id="filter-toilets" checked={hasToiletInfoFilter} value="toilets" onChange={handleFilterType} />
        <T _str="accessible toilet" />
      </label>
      <label htmlFor="filter-blind">
        <StyledCheckbox type="checkbox" name="filter" id="filter-blind" checked={hasBlindFilter} value="blind" onChange={handleFilterType} />
        <T _str="info for blind/visually impaired people" />
      </label>
      <label htmlFor="filter-deaf">
        <StyledCheckbox type="checkbox" name="filter" id="filter-deaf" checked={hasDeafFilter} value="deaf" onChange={handleFilterType} />
        <T _str="info for hearing-impaired people" />
      </label>
    </StyledRadioBox>
  </fieldset>;
}
