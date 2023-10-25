import React, { LegacyRef } from "react";

type Props = {
  name: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ref: LegacyRef<HTMLButtonElement>;  
  className: string;
}

const ActivePreferenceButton = React.forwardRef<HTMLButtonElement, Props>( function ActivePreferenceButton(props: Props, ref) {
  const {className, name }= props;
  return (
    <button value={name} className={className} ref={ref} name={name} onClick={props.onClick}>{name}</button>
  )
});

export default ActivePreferenceButton;