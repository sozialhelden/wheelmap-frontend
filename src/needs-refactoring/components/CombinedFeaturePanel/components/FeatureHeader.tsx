import { Button, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import React, { forwardRef } from "react";
import { useDarkMode } from "~/hooks/useTheme";
import AccessibleIconMarker from "~/modules/map/components/AccessibleIconMarker";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { isWheelchairAccessible } from "~/needs-refactoring/lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

type Props = {
  feature: AnyFeature;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
  tabIndex?: number;
  onIconClicked?: () => void;
};

const FeatureHeader = forwardRef<HTMLHeadingElement, Props>(
  ({ feature, onIconClicked, level, tabIndex }, ref) => {
    const darkMode = useDarkMode();
    const { category, placeName, categoryName } = useFeatureLabel({ feature });
    const accessibilityGrade = isWheelchairAccessible(feature);

    const accessibility = {
      yes: "good",
      no: "bad",
      limited: "mediocre",
      unknown: "unknown",
    }[accessibilityGrade];

    return (
      <Grid columns="1fr 5fr" maxWidth="25rem">
        <Flex justify="start" align="center">
          <Button
            variant="ghost"
            onClick={onIconClicked}
            style={{ padding: 0, margin: 0 }}
            /* centering the map to the poi is a visual feature, so we hide it from screen readers */
            aria-hidden={true}
          >
            <AccessibleIconMarker
              accessibilityGrade={accessibility}
              category={category.id}
              width="3.5rem"
              height="3.5rem"
              shadow={false}
              darkMode={darkMode}
            />
          </Button>
        </Flex>

        {placeName ? (
          <Flex direction="column" gap="1">
            <Heading
              as={level}
              size="5"
              weight="regular"
              ref={ref}
              tabIndex={tabIndex}
            >
              {placeName}
            </Heading>
            <Text size="4">{categoryName}</Text>
          </Flex>
        ) : (
          <Flex align="center">
            <Heading as={level} size="5" weight="regular">
              {categoryName}
            </Heading>
          </Flex>
        )}
      </Grid>
    );
  },
);
export default FeatureHeader;
