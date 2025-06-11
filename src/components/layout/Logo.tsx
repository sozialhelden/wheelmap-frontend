import { Button } from "@radix-ui/themes";
import { t } from "@transifex/native";
import styled from "styled-components";
import { AppStateLink } from "~/needs-refactoring/components/App/AppStateLink";
import type { IBranding } from "~/needs-refactoring/lib/model/ac/IBranding";

const StyledButton = styled<{ $beta?: boolean }>(Button)`
    position: relative;
    &:before {
        display: ${({ $beta }) => ($beta ? "block" : "none")};
        content: "beta";
        position: absolute;
        bottom: .1rem;
        right: .1rem;
        background-color: var(--accent-10);
        color: var(--gray-contrast);
        text-transform: uppercase;
        letter-spacing: .05em;
        font-weight: 600;
        padding: .1rem .2rem;
        line-height: 1;
        border-radius: var(--radius-3);
        font-size: .7rem;
    }
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
  const beta = true;

  return (
    <StyledButton $beta={beta} variant="ghost" asChild>
      <AppStateLink href="/" aria-label={t("Go to home page")}>
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
    </StyledButton>
  );
}
