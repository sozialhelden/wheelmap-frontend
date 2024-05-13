import React from "react";
import { jt, t } from "ttag";
import FilterInputs from "./FilterInputs";
import { StyledColors, StyledFooter, StyledH1, StyledH2, StyledHDivider, StyledIncluscienceLogo, StyledLinkFooter, StyledMainContainerColumn, StyledSectionsContainer, StyledSozialheldInnenLogo } from "./styles";

function SearchFilters() {
  const [headerOptions] = React.useState<any>({
    loadingSpinner: true,
    text: t`Find health sites`,
  });

  const footerList = [
    { href: "https://incluscience.org", content: jt`Powered by ${(<StyledIncluscienceLogo key="StyledIncluscienceLogo" />)}.` },
    { href: "https://sozialhelden.de", content: jt`A project by ${(<StyledSozialheldInnenLogo key="StyledSozialheldInnenLogo" />)}.` },
    { href: "https://openstreetmap.org", content: jt`© OpenStreetMap contributors.` },
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
          <img src="/health/images/BMBF-Logo.jpg" alt="BMBF Logo" width={"50%"} />
        </div>
        {footerList.map((item, index) => (
          <p key={index.toString()}>
            <StyledLinkFooter href={item.href} target="_blank" rel="noreferrer noopener">
              {item.content}
            </StyledLinkFooter>
          </p>
        ))}
      </StyledFooter>
    </StyledMainContainerColumn>
  );
}

export default SearchFilters;
