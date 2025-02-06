import React, { type FC, type ReactNode, useContext, useState } from "react";
import { t } from "ttag";
import { AppStateLink } from "../../../../components/App/AppStateLink";
import { getLayout } from "../../../../components/CombinedFeaturePanel/PlaceLayout";
import FeatureNameHeader from "../../../../components/CombinedFeaturePanel/components/FeatureNameHeader";
import FeatureImage from "../../../../components/CombinedFeaturePanel/components/image/FeatureImage";
import ToiletStatusAccessible from "../../../../components/icons/accessibility/ToiletStatusAccessible";
import ToiletStatusNotAccessible from "../../../../components/icons/accessibility/ToiletStatusNotAccessible";
import RadioButtonOn from "../../../../components/icons/ui-elements/RadioButtonSelected";
import RadioButtonOff from "../../../../components/icons/ui-elements/RadioButtonUnselected";
import { cx } from "../../../../lib/util/cx";

import { FeaturePanelContext } from "../../../../components/CombinedFeaturePanel/FeaturePanelContext";
import { StyledReportView } from "../../../../components/CombinedFeaturePanel/ReportView";

export const AccessibilityView: FC<{
  onClick: () => unknown;
  className?: string;
  inputLabel: string;
  children?: ReactNode;
  selected: boolean;
  icon: ReactNode;
  valueName: string;
}> = ({
  onClick,
  className,
  inputLabel,
  children,
  selected,
  icon,
  valueName,
}) => (
  <div
    className={cx("_option", className)}
    onClick={onClick}
    role="option"
    aria-selected={selected}
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        onClick();
      }
    }}
  >
    <label htmlFor={inputLabel} />
    <header className="_header">
      <input
        id={inputLabel}
        className="_accessibility"
        aria-label="Yes"
        type="radio"
        name="accessibility"
        value="yes"
      />
      {selected ? <RadioButtonOn /> : <RadioButtonOff />}
      {icon}
      <span className="_caption" aria-hidden="true">
        {valueName}
      </span>
    </header>
    {children && <main className="_main">{children}</main>}
  </div>
);

function ReportSendToAC() {
  const { features } = useContext(FeaturePanelContext);
  const [option, setOption] = useState<"yes" | "no" | undefined>(undefined);

  const feature = features[0];

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">Is the toilet here wheelchair accessible?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setOption("yes");
          }}
          className="_yes"
          inputLabel="accessibility-yes"
          selected={option === "yes"}
          icon={<ToiletStatusAccessible />}
          valueName="Yes"
        >
          <ul>
            <li>{t`Doorways' inner width ≥ 35 inches`}</li>
            <li>{t`Clear turning space ≥ 59 inches`}</li>
            <li>{t`Wheelchair-height toilet seat`}</li>
            <li>{t`Foldable grab rails`}</li>
            <li>{t`Accessible sink`}</li>
          </ul>
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setOption("no");
          }}
          className="_no"
          inputLabel="accessibility-no"
          selected={option === "no"}
          icon={<ToiletStatusNotAccessible />}
          valueName="No"
        />
      </form>

      <footer className="_footer">
        <AppStateLink href="../report">
          <div role="button" className="_option _back">
            Back
          </div>
        </AppStateLink>
        {/* @TODO: Implementing the sending request */}
        <div
          role="button"
          className={cx(
            "_option",
            "_primary",
            option === undefined && "_disabled",
          )}
        >
          Continue
        </div>
      </footer>
    </StyledReportView>
  );
}

ReportSendToAC.getLayout = getLayout;

export default ReportSendToAC;
