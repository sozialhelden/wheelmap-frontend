import { Accessibility } from "@sozialhelden/a11yjson";
import { FC } from "react";


export const WheelchairPlaces: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.wheelchairPlaces) {
    return null;
  }

  const { wheelchairPlaces } = accessibility;
  const keys = Object.keys(wheelchairPlaces) as (keyof typeof wheelchairPlaces)[];
  if (keys.length <= 0) {
    return null;
  }
  return (
    <li>
      {`${wheelchairPlaces.count} Wheelchair places`}
    </li>
  );
};
