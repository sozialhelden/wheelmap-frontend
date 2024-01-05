import { Icon } from "@blueprintjs/core";
import { useState } from "react";
import { OSM_API_FEATURE, calculateDistance } from "./helpers";
import { StyledColors, StyledDescription, StyledLegend, StyledLink } from "./styles";

type Props = {
  data: OSM_API_FEATURE;
};

function SearchResult({ data }: Props) {
  const searchResult = data;

  const name = typeof searchResult.name === "string" ? searchResult.name : "Praxis Dr. Linker Platzhalter";
  const { street, website, city, housenumber, postcode, lat, lon } = searchResult || {};
  const customStreet = street ? street + ", " : "";
  const customHousenumber = housenumber ? housenumber + ", " : "";
  const customPostcode = postcode ? postcode + ", " : "";
  const customCity = city ? city : "";
  const customWebsite = website ? website : "";
  const node_type = searchResult.node_type.identifier;
  const category = searchResult.category.identifier;
  const [myCoordinates, setMyCoordinates] = useState<[number, number]>([0, 0]);

  const nodeTypes =
    node_type || category
      ? Array.from([node_type, category]).map((item, index) => {
          return item && <StyledDescription key={index}>{item.replace("_", " ").toUpperCase()}</StyledDescription>;
        })
      : "Keine Adresse";

  // Get coordinates based on my location based on browser geolocation
  navigator.geolocation.getCurrentPosition((position) => {
    setMyCoordinates([position.coords.latitude, position.coords.longitude]);
  });

  return (
    <div className="search-result">
      {myCoordinates && (
        <p style={{ marginBottom: 10, color: StyledColors.red }}>
          <StyledLegend>
            <Icon icon="map-marker" size={20} />
            &nbsp;&nbsp;{calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon).toFixed(2)} KM entfernt
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
      <p className="search-result-description">{nodeTypes}</p>
    </div>
  );
}

export default SearchResult;
