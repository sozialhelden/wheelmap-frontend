import React from "react";

type Props = {
  label: string;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const PreferenceSwitch = React.forwardRef<HTMLInputElement, Props>(function FilterPreferences(props: Props, ref) {
  const { label, onClick } = props;
  return (
    <input 
      ref={ref}
      type="checkbox" 
      role="switch" 
      className="checkbox-switch" 
      name={label} 
      onClick={onClick}
      id={label} 
    />
  );
});

export default PreferenceSwitch;