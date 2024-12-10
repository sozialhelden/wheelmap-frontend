import { useFocusTrap } from "@primer/react/lib-esm/hooks/useFocusTrap";
import { hsl } from "d3-color";
import Link from "next/link";
import * as React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { translatedStringFromObject } from "../../../lib/i18n/translatedStringFromObject";
import { ClientSideConfiguration } from "../../../lib/model/ac/ClientSideConfiguration";
import colors, { alpha } from "../../../lib/util/colors";
import CloseIcon from "../../icons/actions/Close";
import VectorImage from "../../shared/VectorImage";
import AppLinks from "./AppLinks";
import { Button, Card } from "@radix-ui/themes";
import { AppStateLink } from "../AppStateLink";

type Props = {
	onToggle: (isMainMenuOpen: boolean) => void;
	isOpen: boolean;
	clientSideConfiguration: ClientSideConfiguration;
	className?: string;
};

function MenuIcon(props) {
	return (
		<svg
			className="menu-icon"
			width="25px"
			height="18px"
			viewBox="0 0 25 18"
			version="1.1"
			alt="Toggle menu"
			{...props}
		>
			<g stroke="none" strokeWidth={1} fillRule="evenodd">
				<rect x="0" y="0" width="25" height="3" />
				<rect x="0" y="7" width="25" height="3" />
				<rect x="0" y="14" width="25" height="3" />
			</g>
		</svg>
	);
}

const MENU_BUTTON_VISIBILITY_BREAKPOINT = 1024;

const openMenuHoverColor = hsl(colors.primaryColor).brighter(1.4);
openMenuHoverColor.opacity = 0.5;

const StyledNav = styled.nav`
  box-sizing: border-box;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 20;
  overflow: hidden;

  .logo {
    margin-left: 10px;
    margin-right: 10px;
    object-fit: contain;
    object-position: left;
    svg {
      max-width: 140px;
      max-height: 24px;
      width: auto;
    }
  }

  .claim {
    font-weight: 300;
    opacity: 0.6;
    transition: opacity 0.3s ease-out;
    padding-left: 5px;
    flex: 1;
    display: flex;
    justify-content: start;
    align-items: center;

    @media (max-width: 1280px) {
      font-size: 80%;
    }
    @media (max-width: 1180px) {
      display: none;
    }
  }

  #main-menu {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-end;
    align-items: stretch;
    height: 100%;
    overflow: hidden;
    flex: 3;
    min-height: 50px;
  }

  &.is-open {
    #main-menu {
      opacity: 1;
    }
  }

  .nav-link {
    padding: 2px 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .primary-link {
    font: inherit;
    border: 0;
    margin: 0;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;

    &,
    &:visited {
      color: ${colors.linkColor};
    }
  }

  button.menu {
    position: fixed;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    right: 0;
    right: constant(safe-area-inset-right);
    right: env(safe-area-inset-right);
    width: 70px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
  }

  position: absolute;
  top: 0;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  backdrop-filter: var(--backdrop-filter-panel);
  left: 0;
  right: 0;

  @media (max-width: ${MENU_BUTTON_VISIBILITY_BREAKPOINT}px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    backdrop-filter: var(--backdrop-filter-panel);

    #main-menu {
      justify-content: flex-end;
      min-height: 0;
    }

    .activity-indicator {
      position: fixed;
      top: 0;
      top: constant(safe-area-inset-top);
      top: env(safe-area-inset-top);
      right: 0;
      right: constant(safe-area-inset-right);
      right: env(safe-area-inset-right);
      margin-right: 80px;
      margin-top: 20px;
    }

    button.menu {
      opacity: 1;
      pointer-events: inherit;
    }

    .flexible-separator {
      display: none;
    }

    &.is-open {
      #main-menu {
        margin: 16px;
        align-self: flex-end;
      }
    }
  }

  @media (max-height: 400px) {
    padding: 2px 10px 2px 10px;
    padding-left: constant(safe-area-inset-left);
    padding-left: env(safe-area-inset-left);
    &,
    button.menu,
    button.home-button {
      height: 44px;
      min-height: auto;
    }
    &.is-open {
      height: auto;
    }
  }
`;

export default function MainMenu(props: Props) {
	const [isMenuButtonVisible, setIsMenuButtonVisible] = React.useState(false);

	const onResize = React.useCallback(() => {
		if (window.innerWidth > MENU_BUTTON_VISIBILITY_BREAKPOINT) {
			setIsMenuButtonVisible(false);
		} else {
			setIsMenuButtonVisible(true);
			props.onToggle(false);
		}
	}, [props.onToggle, setIsMenuButtonVisible]);

	React.useEffect(() => {
		window.addEventListener("resize", onResize);
		onResize();
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	const toggleMenu = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			props.onToggle(!props.isOpen);
			event.preventDefault();
		},
		[props.onToggle, props.isOpen],
	);

	const productName =
		translatedStringFromObject(
			props.clientSideConfiguration.textContent?.product.name,
		) || "Wheelmap";

	const homeLink = (
		<div className="home-link">
			<AppStateLink href="/" legacyBehavior>
				<Button
					className="home-Button"
					aria-label={t`Home`}
					variant="ghost"
					radius="none"
					color="blue"
				>
					<VectorImage
						className="logo"
						svg={props.clientSideConfiguration.branding?.vectorLogoSVG}
						aria-label={productName}
						maxHeight="30px"
						maxWidth="150px"
						hasShadow={false}
					/>
				</Button>
			</AppStateLink>
		</div>
	);

	const closeButton = (
		<Button
			className="menu"
			variant="ghost"
			radius="none"
			color="blue"
			onClick={toggleMenu}
			aria-hidden={!isMenuButtonVisible}
			tabIndex={isMenuButtonVisible ? 0 : -1}
			aria-label={t`Menu`}
			aria-haspopup="true"
			aria-expanded={props.isOpen}
			aria-controls="main-menu"
		>
			{props.isOpen ? <CloseIcon /> : <MenuIcon />}
		</Button>
	);

	const { isOpen, className, clientSideConfiguration } = props;
	const claim = translatedStringFromObject(
		clientSideConfiguration?.textContent?.product?.claim,
	);

	const classList = [
		className,
		isOpen || !isMenuButtonVisible ? "is-open" : null,
		"main-menu",
	].filter(Boolean);

	const { containerRef } = useFocusTrap({
		disabled: !isMenuButtonVisible || !isOpen,
	});

	return (
    <Card asChild variant="surface">
      <StyledNav
        className={classList.join(" ")}
        ref={containerRef as React.RefObject<HTMLElement>}
      >
        {homeLink}

        <div className="claim">{claim}</div>

        <div id="main-menu" role="menu">
          <AppLinks />
        </div>

        {closeButton}
      </StyledNav>
    </Card>
	);
}
