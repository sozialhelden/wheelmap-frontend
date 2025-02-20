import styled from "styled-components";
import WikidataEntityImage from "~/components/CombinedFeaturePanel/components/image/WikidataEntityImage";
import { useFeatureLabel } from "~/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

const Container = styled.div`
    display: flex;
`;

export function ListItem({ feature }: { feature: AnyFeature }) {
  const languageTags = useCurrentLanguageTagStrings();

  // ariaLabel: "Siegessäule, Viewpoint"
  // buildingName: undefined
  // buildingNumber: undefined
  // category: Object { _id: "viewpoint", icon: "viewpoint", parentIds: (1) […], … }
  // categoryName: "Viewpoint"
  // categoryTagKeys: Array []
  // hasLongName: false
  // levelName: undefined
  // localRef: undefined
  // parentPlaceName: undefined
  // placeName: "Siegessäule"
  // ref: undefined
  // roomNameAndNumber: " "
  const { placeName, categoryName } = useFeatureLabel({
    feature,
    languageTags,
  });

  return (
    <Container>
      <div>
        <p>{placeName}</p>
        <p>{categoryName}</p>
      </div>
      <WikidataEntityImage feature={feature} />
    </Container>
  );
}
