import type { SVGAttributes } from "react";
import AccessibleIconMarkerBase from "./AccessibleIconMarkerBase";
import type { Category } from "~/modules/categories/categories";

export default function AccessibleIconMarker(
  props: SVGAttributes<SVGElement> & {
    accessibilityGrade: string;
    category: Category;
    shadow?: boolean;
  },
) {
  const { shadow, ...markerProps } = props;

  const style = getComputedStyle?.(document.documentElement);

  const backgroundColor = style.getPropertyValue(
    `--rating-${props.accessibilityGrade}`,
  );
  const foregroundColor = style.getPropertyValue(
    `--rating-${props.accessibilityGrade}-contrast`,
  );

  const hasShadow = shadow || shadow === undefined;

  return (
    <AccessibleIconMarkerBase
      {...markerProps}
      foregroundColor={foregroundColor}
      backgroundColor={backgroundColor}
      hasShadow={hasShadow}
      hasHalo={hasShadow}
    />
  );
}
