import React from "react";
import { jt, t } from "ttag";
import FilterInputs from "./FilterInputs";
import { getTheRightLangauge } from "./helpers";
import { StyledColors, StyledFooter, StyledH1, StyledH2, StyledHDivider, StyledIncluscienceLogo, StyledLinkFooter, StyledMainContainerColumn, StyledSectionsContainer, StyledSozialheldInnenLogo } from "./styles";

function SearchFilters() {
  const [headerOptions] = React.useState<any>({
    loadingSpinner: true,
    text: t`Find health sites`,
  });

  const footerListColumn = [
    { href: "https://incluscience.org", content: jt`Powered by ${(<StyledIncluscienceLogo key="StyledIncluscienceLogo" />)}.` },
    { href: "https://sozialhelden.de", content: jt`A project by ${(<StyledSozialheldInnenLogo key="StyledSozialheldInnenLogo" />)}.` },
    { href: "https://openstreetmap.org", content: jt`© OpenStreetMap contributors.` },
  ];

  const footerListRow = [
    { href: getTheRightLangauge({ de: "https://news.wheelmap.org/impressum/", en: "https://news.wheelmap.org/en/imprint/" }), content: t`Impressum` },
    { href: getTheRightLangauge({ de: "https://news.wheelmap.org/kontakt/", en: "https://news.wheelmap.org/en/contact/" }), content: t`Datenschutz` },
  ];

  return (
    <StyledMainContainerColumn>
      <StyledHDivider $space={0.1} />
      <StyledH1 $fontBold>{headerOptions.text}</StyledH1>
      <StyledH2>{t`Find accessible health sites - easily and everywhere.`}</StyledH2>
      <StyledHDivider $colored={StyledColors.silver} />
      <StyledSectionsContainer>
        <FilterInputs />
      </StyledSectionsContainer>

      <div style={{ flex: 1 }} />

      <StyledFooter>
        <div style={{ textAlign: "left" }}>
          <img src="/images/BMBF-Logo.jpg" alt="Gefördert vom Bundesministerium für Bildung und Forschung." width={"30%"} />
        </div>
        {footerListColumn.map((item, index) => (
          <p key={index.toString()}>
            <StyledLinkFooter href={item.href} target="_blank" rel="noreferrer noopener">
              {item.content}
            </StyledLinkFooter>
          </p>
        ))}
      </StyledFooter>
      <StyledFooter $flexDirection="row" style={{ marginTop: 7.5 }}>
        {footerListRow.map((item, index) => (
          <span key={index.toString()}>
            <StyledLinkFooter href={item.href} target="_blank" rel="noreferrer noopener">
              {item.content}
            </StyledLinkFooter>
            {index < footerListRow.length - 1 && <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>}
          </span>
        ))}
      </StyledFooter>
    </StyledMainContainerColumn>
  );
}

export default SearchFilters;
