import React, { forwardRef } from "react";
import { Button, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import AccessibleIconMarker from "~/modules/map/components/AccessibleIconMarker";
import type { CategoryProperties } from "@sozialhelden/core";
import { useDarkMode } from "~/hooks/useTheme";

type Props = {
  accessibilityGrade: "yes" | "no" | "limited" | "unknown";
  category: CategoryProperties;
  placeName: string | undefined;
  categoryName?: string;
  onIconClicked?: () => void;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
  tabIndex?: number;
};

const FeatureDetailsHeader = forwardRef<HTMLHeadingElement, Props>(
  (
    {
      accessibilityGrade,
      category,
      placeName,
      categoryName,
      onIconClicked,
      level,
      tabIndex,
    },
    ref,
  ) => {
    const darkMode = useDarkMode();

    const accessibility = {
      yes: "good",
      no: "bad",
      limited: "mediocre",
      unknown: "unknown",
    }[accessibilityGrade];

    return (
      <Grid columns="1fr 5fr">
        <Flex justify="start" align="center">
          <Button
            variant="ghost"
            onClick={onIconClicked}
            style={{ padding: 0, margin: 0 }}
            aria-hidden={
              true
            } /*centering the map to the poi is a visual feature, so we hide it from screen readers*/
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
export default FeatureDetailsHeader;
