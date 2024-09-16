import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import { useRouter } from "next/router";
import { StyledLabel, StyledSelect, StyledSubLabel } from "../styles";

type Props = {
  healthcareTagStats: any;
  handleInputChange: (event: any) => void;
  translatedHealthcareOptions: any;
};

export function HealthcareTypeFilterFieldset(
  { healthcareTagStats, handleInputChange, translatedHealthcareOptions }: Props,
) {
  const { query } = useRouter();
  return (
    <fieldset>
      <StyledLabel htmlFor="healthcare-select" $fontBold="bold">
        <T _str="Type" />
      </StyledLabel>
      {healthcareTagStats.error && (
        <Callout intent="danger" icon="error">
          <T _str="Could not load place categories." />
        </Callout>
      )}
      {!healthcareTagStats.error && (
        <StyledSelect
          value={query.healthcare}
          name="healthcare"
          id="healthcare-select"
          onChange={handleInputChange}
        >
          <option value="">
            <T _str="All" />
          </option>
          {translatedHealthcareOptions?.map((item, index) => {
            return (
              <option key={item.healthcare + index} value={item.healthcare}>
                {`${item.healthcareTranslated || item.healthcare}`}{" "}
                {item.count ? ` (${item.count})` : ""}
              </option>
            );
          })}
        </StyledSelect>
      )}
      <StyledSubLabel>
        <T _str="Select one of the items in the list." />
      </StyledSubLabel>
    </fieldset>
  );
}
