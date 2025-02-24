import { Button } from "@radix-ui/themes";
import styled from "styled-components";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import type { IBranding } from "~/lib/model/ac/IBranding";

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
`;
const LogoWide = styled.span`
    display: inline-flex;
    align-items: center;
    & > svg {
        max-width: 9rem;
        max-height: 2rem;
    }
    @media (max-width: 768px) {
        display: none;
    }
`;
const LogoSquare = styled.span`
    display: inline-flex;
    align-items: center;
    & > svg {
        max-width: 2.2rem;
        max-height: 2.2rem;
    }
    @media (min-width: 769px) {
        display: none;
    }
`;

export default function Logo({ branding }: { branding?: IBranding }) {
  return (
    <Button variant="ghost" asChild>
      <AppStateLink href="/onboarding" aria-label={t`Go to home page`}>
        <LogoWide
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG code is only set by ourselves.
          dangerouslySetInnerHTML={{
            __html: branding?.vectorLogoSVG?.data ?? "",
          }}
          aria-hidden
        />
        <LogoSquare
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG code is only set by ourselves.
          dangerouslySetInnerHTML={{
            __html: branding?.vectorIconSVG?.data ?? "",
          }}
          aria-hidden
        />
      </AppStateLink>
    </Button>
  );
}
