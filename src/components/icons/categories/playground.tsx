import React from 'react'

function SvgPlayground(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M3 1.15a1.5 1.5 0 112.903.757A1.5 1.5 0 013 1.15zm11 11.17a1 1 0 01-.796 1.17H13.2a1 1 0 01-1.07-.49l-1.68-3.37L9 9.92l-.22.08h-.06v2.15l.62-.15h.14a.52.52 0 01.19 1l-5 1a.51.51 0 01-.17 0 .52.52 0 01-.2-1l4.15-.83V10l-3.22.58a1 1 0 01-1.21-.68H4L3 5.83a1 1 0 010-.43 1 1 0 01.8-.75l4.7-.52V0h.22v4.1h.06L9 4.08 9.4 4h.21a.5.5 0 01.37.6.49.49 0 01-.49.4L9 5.08h-.28v2.86h.06L9 7.88l1.81-.36a1 1 0 011 .6l2 3.94a.999.999 0 01.19.26zM8.5 5.13L6 5.4l.74 2.94L8.5 8V5.13z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgPlayground
