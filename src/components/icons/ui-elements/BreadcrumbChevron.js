import React from "react";

const BreadcrumbChevron = props => (
  <svg width="0.6em" height="1em" viewBox="0 0 30 44" className="breadcrumb-chevron" alt="" {...props}>
    <defs>
      <linearGradient
        x1="30.93%"
        y1="69.921%"
        x2="187.835%"
        y2="68.047%"
        id="a"
      >
        <stop stopColor="#D0D0D0" stopOpacity={0} offset="0%" />
        <stop stopColor="#3B3B3B" stopOpacity={0.716} offset="71.581%" />
        <stop offset="100%" />
      </linearGradient>
    </defs>
    <path
      d="M14.375 43.375h-14v-43h14L26 21.5 14.375 43.375z"
      fill="url(#a)"
      fillRule="evenodd"
    />
  </svg>
);

export default BreadcrumbChevron;