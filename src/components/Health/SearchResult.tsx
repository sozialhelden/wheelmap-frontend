import { faLink, faLocationArrow, faMapPin, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import CustomFontAwesomeIcon from "./Customs/CustomFontAwesomeIcon";
import { calculateDistance, getWheelchairSettings } from "./helpers";
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
  const healthcare = properties.healthcare;
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, [myCoordinates]);

  return (
    <div>
      {myCoordinates && (
        <p style={{ marginBottom: 10, color: StyledColors.red }}>
          <StyledLegend>
            <FontAwesomeIcon icon={faLocationArrow} color={StyledColors.red} />
            &nbsp;&nbsp;
            {calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon).toFixed(2)}
            KM entfernt
          </StyledLegend>
        </p>
      )}
      <StyledLink href={`https://wheelmap.org/${_id}`} target="_blank">
        <h3>
          <CustomFontAwesomeIcon icon={getWheelchairSettings(wheelchair).icon} color={getWheelchairSettings(wheelchair).color} />
          &nbsp;&nbsp;{name} ({healthcare})
        </h3>
      </StyledLink>
      {customStreet && (
        <StyledLink href={"https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon} target="_blank">
          <FontAwesomeIcon icon={faMapPin} />
          &nbsp;&nbsp;{[customStreet, customHousenumber, customPostcode, customCity].join("")}
        </StyledLink>
      )}
      {customStreet && (cutomePhone || customWebsite) && <>&nbsp;&nbsp;|&nbsp;&nbsp;</>}
      {cutomePhone && (
        <StyledLink href={"tel:" + cutomePhone} target="_blank">
          <FontAwesomeIcon icon={faPhone} />
          &nbsp;&nbsp;{cutomePhone}
        </StyledLink>
      )}
      {cutomePhone && customWebsite && <>&nbsp;&nbsp;|&nbsp;&nbsp;</>}
      {customWebsite && (
        <StyledLink href={customWebsite} target="_blank">
          <FontAwesomeIcon icon={faLink} />
          &nbsp;&nbsp;{customWebsite.split("/")[2]}
        </StyledLink>
      )}
    </div>
  );
}

export default SearchResult;
