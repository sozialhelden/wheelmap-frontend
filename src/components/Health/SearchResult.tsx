import { Icon } from "@blueprintjs/core";
import React, { useState } from "react";
import { calculateDistance } from "./helpers";
import { StyledColors, StyledLegend, StyledLink } from "./styles";

type Props = {
  data: any;
};

function SearchResult({ data }: Props) {
  const searchResult = data;

  React.useEffect(() => {}, [searchResult]);

  const { centroid, properties, _id } = searchResult;
  const lat = centroid.coordinates[1];
  const lon = centroid.coordinates[0];
  const name = properties.name;
  const street = properties["addr:street"];
  const housenumber = properties["addr:housenumber"];
  const postcode = properties["addr:postcode"];
  const city = properties["addr:city"];
  const { website, phone, wheelchair } = properties;
  const customStreet = street ? street + ", " : "";
  const customHousenumber = housenumber ? housenumber + ", " : "";
  const customPostcode = postcode ? postcode + ", " : "";
  const customCity = city ? city : "";
  const customWebsite = website ? website : "";
  const cutomePhone = phone ? phone : "";
  const [myCoordinates, setMyCoordinates] = useState<[number, number]>([0, 0]);

  navigator.geolocation.getCurrentPosition((position) => {
    setMyCoordinates([position.coords.latitude, position.coords.longitude]);
  });

  return (
    <div>
      {myCoordinates && (
        <p style={{ marginBottom: 10, color: StyledColors.red }}>
          <StyledLegend>
            <Icon icon="map-marker" size={20} />
            &nbsp;&nbsp;
            {calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon).toFixed(2)}
            KM entfernt
          </StyledLegend>
        </p>
      )}
      <StyledLink href={`https://wheelmap.org/${_id}`} target="_blank">
        <h3>
          <Icon icon="link" size={20} />
          &nbsp;&nbsp;{name}, Rollstuhl : {wheelchair}
        </h3>
      </StyledLink>
      {customStreet && (
        <StyledLink href={"https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon} target="_blank">
          <Icon icon="map-marker" size={20} />
          &nbsp;&nbsp;{[customStreet, customHousenumber, customPostcode, customCity].join("")}
        </StyledLink>
      )}
      {customStreet && (cutomePhone || customWebsite) && <>&nbsp;&nbsp;|&nbsp;&nbsp;</>}
      {cutomePhone && (
        <StyledLink href={"tel:" + cutomePhone} target="_blank">
          <Icon icon="phone" size={20} />
          &nbsp;&nbsp;{cutomePhone}
        </StyledLink>
      )}
      {cutomePhone && customWebsite && <>&nbsp;&nbsp;|&nbsp;&nbsp;</>}
      {customWebsite && (
        <StyledLink href={"tel:" + cutomePhone} target="_blank">
          <Icon icon="link" size={20} />
          &nbsp;&nbsp;{customWebsite.split("/")[2]}
        </StyledLink>
      )}
    </div>
  );
}

export default SearchResult;
