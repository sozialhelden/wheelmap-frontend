import { T, useT } from "@transifex/react";
import styled from "styled-components";
import BMBFLogo from "../icons/ui-elements/BMBFLogo";
import WheelmapLogo from "./WheelmapLogo";
import { StyledIncluscienceLogo, StyledSozialheldInnenLogo, responsiveValue } from "./styles";

const FooterLink = styled.a.attrs({ target: "_blank", rel: "noreferrer noopener" })`
  text-decoration: none;
  min-height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledFooter = styled.footer`
  line-height: 2rem;
  color: rgba(0, 0, 0, 0.7);
  a {
    color: rgba(0, 0, 0, 0.7);
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 3rem;
  margin-right: 2rem;
  @media screen and (max-width: ${responsiveValue}px) {
    margin-bottom: 3rem;
  }
  font-size: 0.9rem;
`;

const StyledBMBFLogo = styled(BMBFLogo)`
  margin-top: .2rem;
  margin-bottom: 2rem;
  height: 3rem;
`;


const StyledWheelmapLogo = styled(WheelmapLogo)`
  height: 1.5rem;
`;

export default function AppFooter() {
  const t = useT();
  return <StyledFooter>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start' }}>
      <FooterLink href="https://wheelmap.org">
        <StyledWheelmapLogo />
      </FooterLink>
      <FooterLink href="https://incluscience.org">
        <StyledIncluscienceLogo />
      </FooterLink>
      <FooterLink href="https://sozialhelden.de">
        <StyledSozialheldInnenLogo key="StyledSozialheldInnenLogo" />
      </FooterLink>
      <FooterLink href="https://openstreetmap.org" style={{ marginLeft: '0.125rem' }}>
        <T _str={"© OpenStreetMap contributors"} />
      </FooterLink>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
        <FooterLink href={t("https://news.wheelmap.org/en/contact")}>
          <T _str={"Contact"} />
        </FooterLink>&nbsp;/&nbsp;
        <FooterLink href={t("https://news.wheelmap.org/en/imprint")}>
          <T _str={"Legal"} />
        </FooterLink>
      </div>
    </div>
    <a href="https://www.bmbf.de/">
      <T _str={"Funded by the"} /><br />
      <StyledBMBFLogo alt={t("German Federal Ministry of Education and Research.")} />
    </a>
  </StyledFooter>;
}