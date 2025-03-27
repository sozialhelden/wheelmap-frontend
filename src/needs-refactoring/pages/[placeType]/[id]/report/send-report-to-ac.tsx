import { Button, Spinner } from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, { type FC, type ReactNode, useContext, useState } from "react";
import { AppStateLink } from "~/needs-refactoring/components/App/AppStateLink";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import ToiletStatusAccessible from "../../../../../components/icons/accessibility/ToiletStatusAccessible";
import ToiletStatusNotAccessible from "../../../../../components/icons/accessibility/ToiletStatusNotAccessible";
import RadioButtonOn from "../../../../../components/icons/ui-elements/RadioButtonSelected";
import RadioButtonOff from "../../../../../components/icons/ui-elements/RadioButtonUnselected";
import { cx } from "~/needs-refactoring/lib/util/cx";
import { getLayout } from "~/components/layouts/DefaultLayout";

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
    aria-selected={selected}
    onKeyDown={onClick}
  >
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

  const feature = features[0].feature?.acFeature;
  if (!feature) {
    return <Spinner />;
  }
  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature} />

      <h2 className="_title">
        {t("Is the toilet here wheelchair accessible?")}
      </h2>

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
            <li>{t(`Doorways' inner width ≥ 35 inches`)}</li>
            <li>{t("Clear turning space ≥ 59 inches")}</li>
            <li>{t("Wheelchair-height toilet seat")}</li>
            <li>{t("Foldable grab rails")}</li>
            <li>{t("Accessible sink")}</li>
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
        <Button asChild>
          <AppStateLink href="../report">Back</AppStateLink>
        </Button>
        {/* @TODO: Implementing the sending request */}
        <Button asChild disabled={option === undefined}>
          Continue
        </Button>
      </footer>
    </StyledReportView>
  );
}

ReportSendToAC.getLayout = getLayout;

export default ReportSendToAC;
