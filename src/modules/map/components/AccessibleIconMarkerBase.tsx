import type { FC, SVGAttributes } from "react";
import { categories, type Category } from "~/modules/categories/categories";

export default function AccessibleIconMarkerBase(
  props: SVGAttributes<SVGElement> & {
    accessibilityGrade: string;
    backgroundColor: string;
    foregroundColor: string;
    hasShadow: boolean;
    hasHalo: boolean;
    category: Category;
  },
) {
  const {
    accessibilityGrade,
    backgroundColor,
    foregroundColor,
    hasShadow,
    hasHalo,
    category,
    ...svgProps
  } = props;

  const halo = hasHalo ? "url(#halo)" : "";
  const shadow = hasShadow ? "url(#shadow)" : "";
  const size = accessibilityGrade === "unknown" ? 0.8 : 1.0;
  const Icon = categories[category].icon as FC<SVGAttributes<SVGElement>>;

  return (
    <svg
      aria-hidden="true"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      {accessibilityGrade === "good" && (
        <circle
          cx={12.5}
          cy={12.5}
          r={10.5}
          fillRule="nonzero"
          fill={backgroundColor}
          filter={halo}
        />
      )}

      {accessibilityGrade === "mediocre" && (
        <path
          d="M6.743 2.364h11.55l5.776 10.003-5.775 10.003H6.743L.967 12.367z"
          fillRule="evenodd"
          fill={backgroundColor}
          filter={halo}
        />
      )}

      {accessibilityGrade === "bad" && (
        <path
          d="M22 22V3.072H3v19z"
          fillRule="nonzero"
          fill={backgroundColor}
          filter={halo}
        />
      )}

      {accessibilityGrade === "unknown" && (
        <path
          d="M.707 12.5l11.794 11.793 11.798-11.79L12.5.707.707 12.5z"
          fillRule="evenodd"
          fill={backgroundColor}
          filter={halo}
        />
      )}

      {Icon && (
        <Icon
          x="5px"
          y="5px"
          transform-origin="center center"
          transform={`scale(${size})`}
          fill={foregroundColor}
          filter={shadow}
        />
      )}

      <defs>
        <filter id="shadow">
          <feDropShadow
            dx={0}
            dy={0}
            stdDeviation={0.5}
            floodColor="black"
            floodOpacity={0.9}
          />
        </filter>
        <filter id="halo">
          <feDropShadow
            dx={0}
            dy={0}
            stdDeviation={2}
            floodColor="white"
            floodOpacity={1}
          />
        </filter>
      </defs>
    </svg>
  );
}
