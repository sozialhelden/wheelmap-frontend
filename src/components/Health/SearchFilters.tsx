import React from "react";
import { jt, t } from "ttag";
import FilterInputs from "./FilterInputs";
import { StyledColors, StyledFooter, StyledH1, StyledH2, StyledHDivider, StyledIncluscienceLogo, StyledLink, StyledMainContainerColumn, StyledSectionsContainer, StyledSozialheldInnenLogo } from "./styles";

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
      <StyledH2 $fontBold>{headerOptions.text}</StyledH2>
      <StyledHDivider $colored={StyledColors.silver} />
      <StyledSectionsContainer>
        <FilterInputs />
      </StyledSectionsContainer>

      <div style={{ flex: 1 }} />

      <StyledFooter>
        <StyledH1 $fontBold>{t`Barrierefreie Praxen finden - einfach und überall.`}</StyledH1>
        {footerList.map((item, index) => (
          <p key={index.toString()}>
            <StyledLink href={item.href} target="_blank" rel="noreferrer noopener">
              {item.content}
            </StyledLink>
          </p>
        ))}
      </StyledFooter>
    </StyledMainContainerColumn>
  );
}

export default SearchFilters;
