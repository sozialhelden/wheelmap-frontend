import React from 'react';

const LimitedWithArrow = (props: any) => {
  return (
    <svg viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path
        strokeOpacity={0.269}
        stroke="#000"
        strokeWidth={0.5}
        d="M18.131 21.776l5.632-9.753-5.632-9.754H6.87l-5.632 9.754 5.632 9.753h2.603l.177.074 2.846 2.85 2.848-2.848.177-.073 2.611-.003z"
        fill={props.fill}
        fillRule="evenodd"
      />
    </svg>
  );
};

export default LimitedWithArrow;
