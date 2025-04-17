// biome-ignore lint/style/useImportType: React is used in JSX
import React from "react";

type Props = {
  accessibilityGrade: string;
  children?: React.ReactNode;
};

export default function ColoredIconMarker(
  props: React.SVGAttributes<SVGElement> & Props,
) {
  const { accessibilityGrade, children } = props;
  const style = getComputedStyle(document.documentElement);

  return (
    <svg
      width="1em"
      aria-hidden="true"
      height="1em"
      viewBox="0 0 25 25"
      {...props}
    >
      {accessibilityGrade === "good" && (
        <circle
          cx={12.5}
          cy={12.5}
          r={10.5}
          fill={style.getPropertyValue("--rating-good")}
          fillRule="nonzero"
          filter="url(#halo)"
        />
      )}

      {accessibilityGrade === "mediocre" && (
        <path
          fill={style.getPropertyValue("--rating-mediocre")}
          d="M6.743 2.364h11.55l5.776 10.003-5.775 10.003H6.743L.967 12.367z"
          fillRule="evenodd"
          filter="url(#halo)"
        />
      )}

      {accessibilityGrade === "bad" && (
        <path
          d="M22 22V3.072H3v19z"
          fill={style.getPropertyValue("--rating-bad")}
          fillRule="nonzero"
          filter="url(#halo)"
        />
      )}

      {accessibilityGrade === "unknown" && (
        <path
          d="M.707 12.5l11.794 11.793 11.798-11.79L12.5.707.707 12.5z"
          fill={style.getPropertyValue("--rating-unknown")}
          fillRule="evenodd"
          filter="url(#halo)"
        />
      )}

      <defs>
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
      {children}
    </svg>
  );
}
