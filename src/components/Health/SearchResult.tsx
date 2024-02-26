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

  const { centroid, properties } = searchResult;
  const lat = centroid.coordinates[1];
  const lon = centroid.coordinates[0];
  const name = properties.name;
  const street = properties["addr:street"];
  const housenumber = properties["addr:housenumber"];
  const postcode = properties["addr:postcode"];
  const city = properties["addr:city"];
  const { website, phone } = properties;
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
    <div className="search-result">
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
      {customWebsite ? (
        <StyledLink href={customWebsite} target="_blank" className="">
          <h3 className="search-result-heading">
            <Icon icon="link" size={20} />
            &nbsp;&nbsp;{name}
          </h3>
        </StyledLink>
      ) : (
        <h3 className="search-result-heading">{name}</h3>
      )}
      <p className="search-result-address">{[customStreet, customHousenumber, customPostcode, customCity].join("")}</p>
      {cutomePhone && (
        <StyledLink href={"tel:" + cutomePhone} target="_blank" className="">
          <p className="search-result-phone">
            <Icon icon="phone" size={20} />
            &nbsp;&nbsp;{cutomePhone}
          </p>
        </StyledLink>
      )}
    </div>
  );
}

export default SearchResult;
