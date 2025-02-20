import { VisuallyHidden } from "@radix-ui/themes";
import { type Ref, useRef } from "react";
import styled from "styled-components";
import { t } from "ttag";
import WikidataEntityImage from "~/components/CombinedFeaturePanel/components/image/WikidataEntityImage";
import { useFeatureLabel } from "~/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

const Container = styled.div`
    display: grid;
    grid-template-columns: auto max-content;
    gap: 1rem;
    width: 100%;
    position: relative;
`;
const TextContainer = styled.div`
  
`;
const Image = styled(WikidataEntityImage)`
    height: 3.75rem;
    width: 3.75rem;
    object-fit: cover;
    border-radius: var(--radius-3)
`;
const PlaceName = styled.a`
    font-size: 1.1rem;
    word-break: break-word;
`;
const Category = styled.p`
    font-size: .9rem;
    color: var(--gray-10);
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
  const { placeName, categoryName, ariaLabel } = useFeatureLabel({
    feature,
    languageTags,
  });

  return (
    <Container>
      <TextContainer>
        <PlaceName href="#" aria-label={t`Open place ${ariaLabel}`}>
          {placeName}
        </PlaceName>
        <Category>{categoryName}</Category>
      </TextContainer>
      <Image feature={feature} verb="P18" />
    </Container>
  );
}
