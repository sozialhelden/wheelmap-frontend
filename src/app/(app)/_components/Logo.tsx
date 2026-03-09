"use client";

import { Button } from "@radix-ui/themes";
import { t } from "@transifex/native";
import styled from "styled-components";
import { AppStateAwareLink } from "~/modules/app-state/components/AppStateAwareLink";
import { useDarkMode } from "~/hooks/useTheme";

import type { WhitelabelBranding } from "~/types/whitelabel";

const StyledButton = styled(Button)<{ $beta?: boolean }>`
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
const LogoWide = styled.span<{ $darkMode?: boolean }>`
    display: inline-flex;
    align-items: center;
    & > svg {
        max-width: 9rem;
        max-height: 2rem;
    }
    @media (max-width: 768px) {
        display: none;
    }
    /* Invert all SVG elements except green ones */
    ${({ $darkMode }) =>
      $darkMode &&
      `
        & > svg *:not([fill="rgb(73, 185, 68)"]):not([fill="#49b944"]):not([fill="#49B944"]) {
            filter: invert(1);
        }
    `}
`;
const LogoSquare = styled.span<{ $darkMode?: boolean }>`
    display: inline-flex;
    align-items: center;
    & > svg {
        max-width: 2.2rem;
        max-height: 2.2rem;
    }
    @media (min-width: 769px) {
        display: none;
    }
    ${({ $darkMode }) =>
      $darkMode &&
      `
        & > svg *:not([fill="rgb(73, 185, 68)"]):not([fill="#49b944"]):not([fill="#49B944"]) {
            filter: invert(1);
        }
    `}
`;

export default function Logo({ branding }: { branding?: WhitelabelBranding }) {
  const beta = true;
  const darkMode = useDarkMode();

  return (
    <StyledButton $beta={beta} variant="ghost" asChild>
      <AppStateAwareLink href="/" aria-label={t("Go to home page")}>
        <LogoWide
          $darkMode={darkMode}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG code is only set by ourselves.
          dangerouslySetInnerHTML={{
            __html: branding?.vectorLogoSVG?.data ?? "",
          }}
          aria-hidden
        />
        <LogoSquare
          $darkMode={darkMode}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG code is only set by ourselves.
          dangerouslySetInnerHTML={{
            __html: branding?.vectorIconSVG?.data ?? "",
          }}
          aria-hidden
        />
      </AppStateAwareLink>
    </StyledButton>
  );
}
