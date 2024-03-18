import { Phone, Place, World } from "../icons/actions";
import { MapPinIcon } from "../icons/ui-elements";
import AccessibilityFilterButtonOnClick from "./AccessibilityFilterButtonOnClick";
import { getWheelchairSettings } from "./helpers";
import { StyledH3, StyledH4, StyledLink, StyledType } from "./styles";

function SearchResult({ data }: any) {
  const { centroid, properties, _id, distance } = data;
  const { name, healthcare, ["addr:street"]: street, ["addr:housenumber"]: housenumber, ["addr:postcode"]: postcode, ["addr:city"]: city, website, phone, wheelchair } = properties;
  const lat = centroid.coordinates[1];
  const lon = centroid.coordinates[0];

  const customAddress = {
    street: street ? street : "",
    housenumber: housenumber ? housenumber : "",
    postcode: postcode ? postcode : "",
    city: city ? city : "",
  };

  const customContact = {
    website: website ? website : "",
    phone: phone ? phone : "",
  };

  return (
    <>
      <div style={{ lineHeight: "2.2rem" }}>
        {distance && (
          <span style={{ float: "right" }}>
            <StyledH4 $fontBold>
              <MapPinIcon /> {distance} KM entfernt
            </StyledH4>
          </span>
        )}
        <StyledType>{healthcare}</StyledType>
        <StyledLink href={`https://wheelmap.org/${_id}`} target="_blank">
          <StyledH3 $fontBold style={{ color: getWheelchairSettings(wheelchair).color }}>
            <AccessibilityFilterButtonOnClick accessibilityFilter={[wheelchair ? wheelchair : "unknown"]} caption={name ? name : healthcare} />
          </StyledH3>
        </StyledLink>
        {customAddress.street && (
          <>
            <StyledLink href={"https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon} target="_blank">
              <Place />
              &nbsp;
              {[customAddress.street, customAddress.housenumber, customAddress.postcode, customAddress.city].join(" ")}
            </StyledLink>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </>
        )}
        {customContact.phone && (
          <>
            <StyledLink href={"tel:" + customContact.phone} target="_blank">
              <Phone />
              &nbsp;{customContact.phone}
            </StyledLink>
            &nbsp;&nbsp;|&nbsp;&nbsp;
          </>
        )}
        {customContact.website && (
          <StyledLink href={customContact.website} target="_blank">
            <World />
            &nbsp;
            {customContact.website.split("/")[2]}
          </StyledLink>
        )}
      </div>
    </>
  );
}

export default SearchResult;
