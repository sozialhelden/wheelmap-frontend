import styled from "styled-components";
import WikidataEntityImage from "~/components/CombinedFeaturePanel/components/image/WikidataEntityImage";
import { useFeatureLabel } from "~/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

const Container = styled.div`
    display: grid;
    grid-template-columns: auto max-content;
    gap: 1rem;
    
`;

const TextContainer = styled.div`
  
`;

const Image = styled(WikidataEntityImage)`
  height: 3.75rem;
    width: 3.75rem;
    object-fit: cover;
    border-radius: var(--radius-3)
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
      <TextContainer>
        <p>{placeName}sdfagdfa ksdhgfasdkjf hasdfkasdhfgsdfhdg</p>
        <p>{categoryName}</p>
      </TextContainer>
      <Image feature={feature} verb="P18" />
    </Container>
  );
}
