import { createGlobalStyle } from 'styled-components';

export function systemFontStack() {
  return '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
}

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #6c7374;
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 100;
    font-display: swap;
    src: url("/fonts/Inter-Thin.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Thin.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 100;
    font-display: swap;
    src: url("/fonts/Inter-ThinItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-ThinItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 200;
    font-display: swap;
    src: url("/fonts/Inter-ExtraLight.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-ExtraLight.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 200;
    font-display: swap;
    src: url("/fonts/Inter-ExtraLightItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-ExtraLightItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: url("/fonts/Inter-Light.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Light.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 300;
    font-display: swap;
    src: url("/fonts/Inter-LightItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-LightItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/Inter-Regular.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Regular.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/Inter-Italic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Italic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/Inter-Medium.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Medium.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/Inter-MediumItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-MediumItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/Inter-SemiBold.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-SemiBold.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/Inter-SemiBoldItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-SemiBoldItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url("/fonts/Inter-Bold.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Bold.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 700;
    font-display: swap;
    src: url("/fonts/Inter-BoldItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-BoldItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 800;
    font-display: swap;
    src: url("/fonts/Inter-ExtraBold.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-ExtraBold.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 800;
    font-display: swap;
    src: url("/fonts/Inter-ExtraBoldItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-ExtraBoldItalic.woff?v=3.19") format("woff");
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: url("/fonts/Inter-Black.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-Black.woff?v=3.19") format("woff");
  }
  @font-face {
    font-family: "Inter";
    font-style: italic;
    font-weight: 900;
    font-display: swap;
    src: url("/fonts/Inter-BlackItalic.woff2?v=3.19") format("woff2"),
      url("/fonts/Inter-BlackItalic.woff?v=3.19") format("woff");
  }

  /* -------------------------------------------------------
  Variable font.
  Usage:

    html { font-family: 'Inter', sans-serif; }
    @supports (font-variation-settings: normal) {
      html { font-family: 'Inter var', sans-serif; }
    }
  */
  @font-face {
    font-family: "Inter var";
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
    font-named-instance: "Regular";
    src: url("/fonts/Inter-roman.var.woff2?v=3.19") format("woff2");
  }
  @font-face {
    font-family: "Inter var";
    font-weight: 100 900;
    font-display: swap;
    font-style: italic;
    font-named-instance: "Italic";
    src: url("/fonts/Inter-italic.var.woff2?v=3.19") format("woff2");
  }

  /* --------------------------------------------------------------------------
  [EXPERIMENTAL] Multi-axis, single variable font.

  Slant axis is not yet widely supported (as of February 2019) and thus this
  multi-axis single variable font is opt-in rather than the default.

  When using this, you will probably need to set font-variation-settings
  explicitly, e.g.

    * { font-variation-settings: "slnt" 0deg }
    .italic { font-variation-settings: "slnt" 10deg }

  */
  @font-face {
    font-family: "Inter var experimental";
    font-weight: 100 900;
    font-display: swap;
    font-style: oblique 0deg 10deg;
    src: url("/fonts/Inter.var.woff2?v=3.19") format("woff2");
  }


  body,
  button,
  input,
  select,
  textarea {
    font-family: 'Inter', ${systemFontStack()};
    font-size: 16px;
    font-style: normal;
    -moz-font-feature-settings: "ss01", "ss04", "cv09", "cv08", "kern";
    -webkit-font-feature-settings: "ss01", "ss04", "cv09", "cv08", "kern";
    font-feature-settings: "ss01", "ss04", "cv09", "cv08", "kern";
  }

  body {
    position: fixed;
    overscroll-behavior: none;
  }

  html,
  body {
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body,
  #__next,
  .main-view {
    top: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  /*
      This will hide the focus indicator if the element receives focus via the mouse,
      but it will still show up on keyboard focus.
    */

  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }

  /*
      We use a stronger and consistent focus indicator when an element receives focus via
      keyboard.
    */

  .js-focus-visible .focus-visible {
    outline: none;
    box-shadow: inset 0px 0px 0px 2px #4469e1;
    transition: box-shadow 0.2s;
  }

  .radio-group:focus-within,
  [role="radiogroup"]:focus-within {
    box-shadow: 0px 0px 0px 2px #4469e1;
    transition: box-shadow 0.2s;
  }

  .sr-only {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .subtle {
    opacity: 0.6;
  }

  kbd {
    background-color: transparent;
    border-radius: 3px;
    border: 1px solid #b4b4b4;
    color: rgba(255, 255, 255, 0.8);
    display: inline-block;
    line-height: 1;
    padding: 2px 4px;
    margin-left: 3px;
    margin-right: 3px;
    white-space: nowrap;
  }
`;

export default GlobalStyle;
