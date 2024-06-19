import { T, useT } from "@transifex/react";
import styled from "styled-components";
import BMBFLogo from "./BMBFLogo";
import { StyledIncluscienceLogo, StyledSozialheldInnenLogo, responsiveValue } from "./styles";

const FooterLink = styled.a.attrs({ target: "_blank", rel: "noreferrer noopener" })`
  display: flex;
  text-decoration: none;
  color: #555;
  min-height: 2rem;
`;

const FooterLinkHorizontal = styled(FooterLink)`
  flex-direction: row;
  align-items: center;
`;

const FooterLinkVertical = styled(FooterLink)`
  flex-direction: column;
`;

const StyledBMBFLogo = styled(BMBFLogo)`
  margin-top: .8rem;
  margin-bottom: 2rem;
  height: 3.5rem;
`;

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  font-size: 0.9rem;
  margin-top: 3rem;
  @media screen and (max-width: ${responsiveValue}px) {
    margin-bottom: 3rem;
  }
`;

export default function AppFooter() {
  const t = useT();
  return <StyledFooter>
    <div style={{ paddingTop: '0.4rem' }}>
      <FooterLinkVertical href="https://www.bmbf.de/">
        <T _str={"Funded by the"} /><br />
        <StyledBMBFLogo alt={t("German Federal Ministry of Education and Research.")} />
      </FooterLinkVertical>
    </div>
    <div>
      <FooterLinkHorizontal href="https://openstreetmap.org" style={{ marginLeft: '0.125rem' }}>
        <T _str={"© OpenStreetMap contributors"} />
      </FooterLinkHorizontal>
      <FooterLinkHorizontal href="https://sozialhelden.de">
        <StyledSozialheldInnenLogo key="StyledSozialheldInnenLogo" />
      </FooterLinkHorizontal>
      <FooterLinkHorizontal href="https://incluscience.org">
        <StyledIncluscienceLogo key="StyledIncluscienceLogo" style={{ marginLeft: '0.1rem' }} />
      </FooterLinkHorizontal>
      <FooterLinkHorizontal href={t("https://news.wheelmap.org/en/contact")}>
        <T _str={"Contact"} />
      </FooterLinkHorizontal>
      <FooterLinkHorizontal href={t("https://news.wheelmap.org/en/imprint")}>
        <T _str={"Legal"} />
      </FooterLinkHorizontal>
    </div>
  </StyledFooter>;
}