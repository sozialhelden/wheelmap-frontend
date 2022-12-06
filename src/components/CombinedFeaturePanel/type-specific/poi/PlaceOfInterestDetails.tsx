import { AnyFeature } from "../../../../lib/model/shared/AnyFeature";
import FeatureAccessibility from "../../components/FeatureAccessibility";
import FeatureNameHeader from "../../components/FeatureNameHeader";
import FeaturesDebugJSON from "../../components/FeaturesDebugJSON";
import AddressMapsLinkItems from "../../components/IconButtonList/AddressMapsLinkItems";
import ExternalInfoAndEditPageLinks from "../../components/IconButtonList/ExternalInfoAndEditPageLinks";
import PhoneNumberLinks from "../../components/IconButtonList/PhoneNumberLinks";
import PlaceWebsiteLink from "../../components/IconButtonList/PlaceWebsiteLink";
import StyledIconButtonList from "../../components/IconButtonList/StyledIconButtonList";
import FeatureImage from "../../components/image/FeatureImage";

type Props = {
  feature: AnyFeature;
};

export default function PlaceOfInterestDetails(props: Props) {
  const { feature } = props;

  return (
    <>
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <FeatureAccessibility></FeatureAccessibility>
      <StyledIconButtonList>
        <AddressMapsLinkItems feature={feature} />
        <PlaceWebsiteLink feature={feature} />
        <PhoneNumberLinks {...props} />
        {feature["@type"] === "a11yjson:PlaceInfo" && (
          <ExternalInfoAndEditPageLinks feature={feature} />
        )}
        {/*
        <ShareButtons {...props} />
        {!props.equipmentInfoId && <ReportIssueButton {...props} />} */}
      </StyledIconButtonList>
      <FeaturesDebugJSON features={[feature]} />
    </>
  );
}
