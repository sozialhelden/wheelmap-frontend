import { useT } from "@transifex/react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import StyledMarkdown from "../shared/StyledMarkdown";

type Props = {
  regionName?: string;
}

const Section = styled.section`
  padding: 2rem;
  margin: 2rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  color: rgba(0, 0, 0, 0.8);
`;


export default function NonIdealState(props: Props) {
  const t = useT();

  const emoji = '🤔'
  const title = t("There’s nothing here yet. Why?");
  const ctaSummary = t("There is still **too little open data** on health for blind and deaf people – **but that can change!**");
  const ctaInstructions = t("Are you familiar with OpenStreetMap, Wikipedia, or OpenData? Then [go to OpenStreetMap](https://www.openstreetmap.org/search?query={locationName}) and **add the following tags** on places:").replace('{locationName}', props.regionName || '');
  const languageTags = useCurrentLanguageTagStrings();
  const osmLanguageTag = languageTags[0]?.match(/^[a-z]+/)?.[0] || 'en';
  const tags = `
  - [blind:description:${osmLanguageTag}](https://wiki.openstreetmap.org/wiki/Disabilitydescription)
  - [deaf:description:${osmLanguageTag}](https://wiki.openstreetmap.org/wiki/Disabilitydescription)
  - [wheelchair:description:${osmLanguageTag}](https://wiki.openstreetmap.org/wiki/Disabilitydescription)
  `;
  const websiteHint = t("Often, you can find accessibility infos on hospital or practice websites – letʼs collect this information together!");
  const processExplanation = t("Changed entries usually show up in search results after around two hours. [Wheelmap](https://wheelmap.org) will display the infos more prominently soon." );

  return <Section>
    <h2>{emoji} {title}</h2>
    <StyledMarkdown>
      {ctaSummary}
    </StyledMarkdown>
    <StyledMarkdown>
      {ctaInstructions}
    </StyledMarkdown>
    <StyledMarkdown>
      {tags}
    </StyledMarkdown>
    <StyledMarkdown>
      {websiteHint}
    </StyledMarkdown>
    <StyledMarkdown>
      {processExplanation}
    </StyledMarkdown>
  </Section>
}
