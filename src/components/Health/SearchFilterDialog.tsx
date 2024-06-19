import { T } from "@transifex/react";
import FilterInputs from "./FilterInputs";
import { getTheRightLangauge } from "./helpers";
import { StyledClaim, StyledColors, StyledFooter, StyledH1, StyledHDivider, StyledIncluscienceLogo, StyledLinkFooter, StyledMainContainerColumn, StyledSectionsContainer, StyledSozialheldInnenLogo } from "./styles";

function SearchFilterDialog(props: any) {
  const footerListColumn = [
    {
      href: "https://incluscience.org",
      content: (
        <>
          <T _str={`Powered by`} />
          &nbsp;
          <StyledIncluscienceLogo key="StyledIncluscienceLogo" />
        </>
      ),
    },
    {
      href: "https://sozialhelden.de",
      content: (
        <>
          <T _str={`A project by`} />
          &nbsp;
          <StyledSozialheldInnenLogo key="StyledSozialheldInnenLogo" />.
        </>
      ),
    },
    { href: "https://openstreetmap.org", content: <T _str={`© OpenStreetMap contributors.`} /> },
  ];

  const footerListRow = [
    { href: getTheRightLangauge({ de: "https://news.wheelmap.org/impressum/", en: "https://news.wheelmap.org/en/imprint/" }), content: <T _str={`Impressum`} /> },
    { href: getTheRightLangauge({ de: "https://news.wheelmap.org/kontakt/", en: "https://news.wheelmap.org/en/contact/" }), content: <T _str={`Datenschutz`} /> },
  ];

  return (
    <StyledMainContainerColumn>
      <StyledHDivider $space={0.1} />
      <StyledH1 $fontBold>
        <T _str="Find accessible health sites - easily and everywhere." />
        <StyledClaim>
          <T _str="- easily and everywhere." />
        </StyledClaim>
      </StyledH1>
      <StyledHDivider $colored={StyledColors.silver} />
      <StyledSectionsContainer>
        <FilterInputs />
      </StyledSectionsContainer>

      <div style={{ flex: 1 }} />

      <StyledFooter>
        <div style={{ textAlign: "left" }}>
          <img src="/images/BMBF-Logo.jpg" alt={"Gefördert vom Bundesministerium für Bildung und Forschung."} width={"30%"} />
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

export default SearchFilterDialog;
