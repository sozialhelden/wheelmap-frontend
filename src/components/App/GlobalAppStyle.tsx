import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #6c7374;
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

  body,
  button,
  input,
  select,
  textarea {
    /* Mix of the two system font stacks used by GitHub and Medium. */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
