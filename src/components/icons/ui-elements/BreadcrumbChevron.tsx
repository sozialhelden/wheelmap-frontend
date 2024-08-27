import React from 'react'

function SvgBreadcrumbChevron(props: any) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 22 50" {...props}>
      <defs>
        <linearGradient
          x1="30.93%"
          y1="69.921%"
          x2="187.835%"
          y2="68.047%"
          id="BreadcrumbChevron_svg__a"
        >
          <stop stopColor="#D0D0D0" stopOpacity={0} offset="0%" />
          <stop stopColor="#3B3B3B" stopOpacity={0.716} offset="71.581%" />
          <stop offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fillOpacity={0.5}
          fill="url(#BreadcrumbChevron_svg__a)"
          d="M17.143 50H0V0h17.143l12.571 25z"
          transform="translate(-9)"
        />
        <path fillOpacity={0.3} fill="#000" d="M8.139 0h1.285l12.572 25L9.424 50H8.14L20.71 25z" />
      </g>
    </svg>
  )
}

export default SvgBreadcrumbChevron
