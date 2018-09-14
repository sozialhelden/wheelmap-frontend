import { createGlobalStyle } from 'styled-components';

const MapStyle = createGlobalStyle`
  body.is-touch-device .leaflet-control-zoom {
    display: none;
  }

  @media (max-width: 1024px) {
    .leaflet-control-container .leaflet-top {
      top: 0px;
      top: constant(safe-area-inset-top);
      top: env(safe-area-inset-top);
      margin-top: 50px;
    }
    .leaflet-control-container .leaflet-right {
      right: 0px;
      right: constant(safe-area-inset-right);
      right: env(safe-area-inset-right);
    }
  }

  .leaflet-container {
    flex: 1;
    width: 100vw;
    height: calc(100vh - 50px);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  @media (max-width: 1024px) {
    .leaflet-container {
      height: 100vh;
    }
  }

  .leaflet-container.focus-visible::after {
    content: '';
    border-radius: 4px;
    box-shadow: inset 0px 0px 0px 6px #4469E1;
    width: 100%;
    height: 100%;
    z-index: 500;
    position: absolute;
    pointer-events: none;
  }

  .leaflet-icon-locate:before {
    display: block;
    position: absolute;
    top: 7px;
    left: 2px;
    width: 31px;
    height: 24px;
    opacity: 0.75;
    content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjEgKDQzNTA0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5sb2NhdGUtb2ZmPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9ImxvY2F0ZS1vZmYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDA2MTM5LCAtMC4zNjIxMzMpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9IiMwMDAwMDAiPgogICAgICAgICAgICA8cGF0aCBkPSJNNS43Nzc5OTA3NCwxNC43OTkwMzI3IEw5LjI2MTkwODY2LDE0LjgwMTIxMDYgTDkuMjY0MDg2NjIsMTguMjg1MTI4NSBMMTUuNjQ1MDk4Niw4LjQxODAyMDY4IEw1Ljc3Nzk5MDc0LDE0Ljc5OTAzMjcgWiBNMjAuNzAxMTY1NSwzLjM2MTk1MzggTDcuNzY3MjYwMDgsMjMuMzYxOTUzOCBMNy43NjI4NDU1LDE2LjMwMDI3MzggTDAuNzAxMTY1NDgyLDE2LjI5NTg1OTIgTDIwLjcwMTE2NTUsMy4zNjE5NTM4IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
  }

  .is-android-platform .leaflet-icon-locate:before {
    top: 7px;
    left: 2px;
    content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHZpZXdCb3g9Ii0yIC0xIDI0IDIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0aXRsZT5sb2NhdGUtb2ZmIGFuZHJvaWQ8L3RpdGxlPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zLjk5NCAtMi4zNjIpIiBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMi45NzMgNC45OGE3LjE0NSA3LjE0NSAwIDAgMSA2LjM5MyA2LjM5M2gyLjE3OHYxLjQyOWgtMi4xNzhhNy4xNDUgNy4xNDUgMCAwIDEtNi4zOTMgNi4zOTN2Mi4xNzhoLTEuNDI5di0yLjE3OGE3LjE0NSA3LjE0NSAwIDAgMS02LjM5My02LjM5M0gyLjk3M3YtMS40MjlINS4xNWE3LjE0NSA3LjE0NSAwIDAgMSA2LjM5My02LjM5M1YyLjgwMmgxLjQyOVY0Ljk4em0tLjcxNSAxMi45NTJhNS44NDQgNS44NDQgMCAxIDAgMC0xMS42ODkgNS44NDQgNS44NDQgMCAwIDAgMCAxMS42ODl6Ii8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii40MDUiIGN4PSIxMi4yNTgiIGN5PSIxMi4wODgiIHI9IjMuMjQ3Ii8+PC9nPjwvc3ZnPg==);
  }

  .leaflet-control-locate.active .leaflet-icon-locate:before {
    display: block;
    position: absolute;
    top: 7px;
    left: 7px;
    width: 31px;
    height: 24px;
    content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjEgKDQzNTA0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5sb2NhdGUtb248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+CiAgICAgICAgPGcgaWQ9ImxvY2F0ZS1vbiIgZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSIjMzlBQkRCIj4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IkNvbWJpbmVkLVNoYXBlIiBwb2ludHM9IjIwLjcwNzMwNDggMi45OTk4MjExMSA3Ljc3MzM5OTQgMjIuOTk5ODIxMSA3Ljc2ODk4NDgzIDE1LjkzODE0MTEgMC43MDczMDQ4MDkgMTUuOTMzNzI2NSI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
  }

  .is-android-platform .leaflet-control-locate.active .leaflet-icon-locate:before {
    top: 7px;
    left: 7px;
    content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHZpZXdCb3g9Ii0yIC0xIDI0IDIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIgMCkiPjxwYXRoIGQ9Ik0xMC45NzkgMi42MThhNy4xNDUgNy4xNDUgMCAwIDEgNi4zOTMgNi4zOTNoMi4xNzh2MS40MjloLTIuMTc4YTcuMTQ1IDcuMTQ1IDAgMCAxLTYuMzkzIDYuMzkzdjIuMTc4SDkuNTV2LTIuMTc4YTcuMTQ1IDcuMTQ1IDAgMCAxLTYuMzkzLTYuMzkzSC45NzlWOS4wMWgyLjE3OEE3LjE0NSA3LjE0NSAwIDAgMSA5LjU1IDIuNjE4Vi40NGgxLjQyOXYyLjE3OHptLS43MTQgMTIuOTUyYTUuODQ0IDUuODQ0IDAgMSAwIDAtMTEuNjg5IDUuODQ0IDUuODQ0IDAgMCAwIDAgMTEuNjg5em0wLTIuNTk4YTMuMjQ3IDMuMjQ3IDAgMSAxIDAtNi40OTMgMy4yNDcgMy4yNDcgMCAwIDEgMCA2LjQ5M3oiIGZpbGw9IiMzOUFCREIiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4=);
  }

  @keyframes loopedFading {
    0% {
      opacity: 1.0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1.0;
    }
  }


  .leaflet-control-locate.requesting .leaflet-icon-locate-loading:before {
    display: block;
    position: absolute;
    top: 7px;
    left: 7px;
    width: 31px;
    height: 24px;
    animation: loopedFading 0.5s linear infinite;
    content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjEgKDQzNTA0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5sb2NhdGUtb248L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LCAwKSI+CiAgICAgICAgPGcgaWQ9ImxvY2F0ZS1vbiIgZmlsbC1ydWxlPSJub256ZXJvIiBmaWxsPSIjMzlBQkRCIj4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IkNvbWJpbmVkLVNoYXBlIiBwb2ludHM9IjIwLjcwNzMwNDggMi45OTk4MjExMSA3Ljc3MzM5OTQgMjIuOTk5ODIxMSA3Ljc2ODk4NDgzIDE1LjkzODE0MTEgMC43MDczMDQ4MDkgMTUuOTMzNzI2NSI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
  }

  .is-android-platform .leaflet-control-locate.requesting .leaflet-icon-locate-loading:before {
    top: 7px;
    left: 7px;
    content: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjIiIHZpZXdCb3g9Ii0yIC0xIDI0IDIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIgMCkiPjxwYXRoIGQ9Ik0xMC45NzkgMi42MThhNy4xNDUgNy4xNDUgMCAwIDEgNi4zOTMgNi4zOTNoMi4xNzh2MS40MjloLTIuMTc4YTcuMTQ1IDcuMTQ1IDAgMCAxLTYuMzkzIDYuMzkzdjIuMTc4SDkuNTV2LTIuMTc4YTcuMTQ1IDcuMTQ1IDAgMCAxLTYuMzkzLTYuMzkzSC45NzlWOS4wMWgyLjE3OEE3LjE0NSA3LjE0NSAwIDAgMSA5LjU1IDIuNjE4Vi40NGgxLjQyOXYyLjE3OHptLS43MTQgMTIuOTUyYTUuODQ0IDUuODQ0IDAgMSAwIDAtMTEuNjg5IDUuODQ0IDUuODQ0IDAgMCAwIDAgMTEuNjg5em0wLTIuNTk4YTMuMjQ3IDMuMjQ3IDAgMSAxIDAtNi40OTMgMy4yNDcgMy4yNDcgMCAwIDEgMCA2LjQ5M3oiIGZpbGw9IiMzOUFCREIiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4=);
  }


  @media (max-height: 500px), (max-width: 500px) {
    .leaflet-bottom.leaflet-left {
      bottom: 80px;
      z-index: 999;
    }

    .leaflet-left .leaflet-control-scale {
      margin-left: 10px;
    }
  }

  .ac-marker {
    border-radius: 10px;
    background-color: #e6e4e0;
    /*transition: box-shadow ease-out 0.3s;*/
    /* border: 1px rgba(255, 255, 255, 0.7) solid; */
    border: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    /* text-align: center;  */
    color: white;
    line-height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  @keyframes popUp {
    0% {
      transform: scale3d(0.3, 0.3, 0.3) translate3d(0, -5px, 0);
    }
    50% {
      transform: scale3d(.75, .75, .75) translate3d(0, -20px, 0);
    }
    100% {
      transform: scale3d(1, 1, 1) translate3d(0, 0px, 0);
    }
  }

  .marker-icon {
    border-radius: 100%;
  }

  .highlighted-marker.animated figure {
    animation: popUp 0.2s ease;
    transform: scale3d(1, 1, 1) translate3d(0, 0px, 0);
  }

  .highlighted-marker svg {
    width: 30px;
    height: 30px;
  }

  .ac-marker-gray .ac-big-icon-marker {
    background-color: #e6e4e0;
  }

  .ac-marker-green, .ac-marker-green .ac-big-icon-marker {
    background-color: #7ec512;
  }

  .ac-marker-green .ac-big-icon-marker:after {
    background-color: #7ec512
  }

  .ac-marker-yellow, .ac-marker-yellow .ac-big-icon-marker {
    background-color: #f39e3b;
  }

  .ac-marker-yellow .ac-big-icon-marker:after {
    background-color: #f39e3b;
  }

  .ac-marker-red, .ac-marker-red .ac-big-icon-marker {
    background-color: #f54b4b;
  }

  .ac-marker-red .ac-big-icon-marker:after, .ac-marker-red .ac-big-icon-marker {
    background-color: #f54b4b;
  }

  .ac-marker-yellow svg g,
  .ac-marker-green svg g,
  .ac-marker-red svg g,
  .ac-marker-cluster svg g  {
    fill: white;
  }

  .ac-marker-gray svg g {
    fill: rgb(105, 97, 91);
  }

  .ac-markers svg {
    margin: 2px;
  }

  .ac-marker svg {
    transition: transform ease-out 0.1s, opacity ease-out 0.6s;
    transform: scale3d(1, 1, 1);
    opacity: 1;
  }
  .ac-marker svg g,
  .ac-marker svg polygon,
  .ac-marker svg path,
  .ac-marker svg circle,
  .ac-marker svg rect {
    fill: white;
  }


  .ac-marker-current {
    background-color: transparent;
    box-shadow: none;
    /* Force currently selected marker to be  shown on top of all markers */
    z-index: 100000000 !important;
    /* Allow to select PoIs behind the currently highlighted marker */
    pointer-events: none !important;
  }

  .ac-marker-current > figure {
    opacity: 0;
  }

  @media (hover), (-moz-touch-enabled: 0) {
    .leaflet-marker-pane > .ac-marker:not(.ac-marker-current):hover {
      box-shadow: 0 0 2px black;
    }
  }

  .ac-marker-cluster {
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.75);
  }

  /* increase click region of marker clusters */
  .ac-marker-cluster::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    border: 25px transparent solid;
    border-radius: 100%;
  }

  .ac-marker-cluster.over-fifty {
    margin-left: -13px !important;
    margin-top: -13px !important;
    width: 24px !important;
    height: 24px !important;
    border-radius: 12px !important;
  }

  .ac-marker-cluster.over-hundred {
    margin-left: -14px !important;
    margin-top: -14px !important;
    width: 26px !important;
    height: 26px !important;
    border-radius: 13px !important;
    opacity: 0.9 !important;
    font-size: 115%;
  }

  .ac-marker-cluster.over-fivehundred {
    margin-left: -21px !important;
    margin-top: -21px !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 20px !important;
    opacity: 0.9 !important;
    font-size: 125%;
  }

  @media (hover), (-moz-touch-enabled: 0) {
    .ac-marker-cluster:hover {
      opacity: 1 !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  .leaflet-control-locate {
    cursor: pointer;
  }

  .ac-marker-name-tooltip {
    padding: 0;
    border: none;
    box-shadow: none;
    background-color: rgba(230, 228, 224, 0.9);
    /* background-color: transparent; */
    text-shadow: 0 0 0px white;
    /* word-break: break-word; */
    color: #735139;
    width: 90px;
    font-size: 11px;
    max-width: 80px;
    white-space: initial;
    text-align: center;
    font-weight: 500;
    line-height: 1.2;
    display: flex;
    justify-content: center;
  }

  .ac-marker-name-tooltip:before {
    display: none;
  }

  .leaflet-control-layers, .leaflet-bar {
    border: none !important;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3) !important;
  }

  .leaflet-bar a {
    width: 50px !important;
    height: 50px !important;
    line-height: 50px !important;
    color: rgba(0, 0, 0, 0.7) !important;
  }

  .leaflet-bar a:hover {
    background-color: rgb(218, 241, 255) !important;
    color: #2e6ce0 !important;
  }

  .leaflet-bar a.leaflet-disabled {
    background-color: #eee !important;
    color: rgba(0, 0, 0, 0.3) !important;
  }

  .leaflet-icon-locate:before {
    position: relative;
    width: 50px;
    height: 50px;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
    }
  }

  .leaflet-marker-icon {
    animation: fadeIn 0.6s ease-out;
  }

  .leaflet-marker-icon.focus-visible {
    border-radius: 4px;
    box-shadow: 0px 0px 0px 6px #4469E1;
    transition: box-shadow 0.2s;
  }

  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .mapbox-attribution-container {
    bottom: 0;
    right: 0;
    right: constant(safe-area-inset-right);
    right: env(safe-area-inset-right);
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    position: absolute;
    display: block;
    padding: 5px 10px 5px 2px;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.8);
    -webkit-backgrop: filter(10px);
  }

  .mapbox-attribution-container .sozialhelden-logo {
    vertical-align: bottom;
  }

  .mapbox-wordmark {
    position: absolute;
    display: block;
    height: 20px;
    width: 65px;
    left: 10px;
    bottom: 10px;
    text-indent: -9999px;
    z-index: 1000;
    overflow: hidden;

    // 'background-image' contains the Mapbox wordmark 
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgODAuNDcgMjAuMDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDgwLjQ3IDIwLjAyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe29wYWNpdHk6MC42O2ZpbGw6I0ZGRkZGRjtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30uc3Qxe29wYWNpdHk6MC42O2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fTwvc3R5bGU+PGc+PHBhdGggY2xhc3M9InN0MCIgZD0iTTc5LjI5LDEzLjYxYzAsMC4xMS0wLjA5LDAuMi0wLjIsMC4yaC0xLjUzYy0wLjEyLDAtMC4yMy0wLjA2LTAuMjktMC4xNmwtMS4zNy0yLjI4bC0xLjM3LDIuMjhjLTAuMDYsMC4xLTAuMTcsMC4xNi0wLjI5LDAuMTZoLTEuNTNjLTAuMDQsMC0wLjA4LTAuMDEtMC4xMS0wLjAzYy0wLjA5LTAuMDYtMC4xMi0wLjE4LTAuMDYtMC4yN2MwLDAsMCwwLDAsMGwyLjMxLTMuNWwtMi4yOC0zLjQ3Yy0wLjAyLTAuMDMtMC4wMy0wLjA3LTAuMDMtMC4xMWMwLTAuMTEsMC4wOS0wLjIsMC4yLTAuMmgxLjUzYzAuMTIsMCwwLjIzLDAuMDYsMC4yOSwwLjE2bDEuMzQsMi4yNWwxLjMzLTIuMjRjMC4wNi0wLjEsMC4xNy0wLjE2LDAuMjktMC4xNmgxLjUzYzAuMDQsMCwwLjA4LDAuMDEsMC4xMSwwLjAzYzAuMDksMC4wNiwwLjEyLDAuMTgsMC4wNiwwLjI3YzAsMCwwLDAsMCwwTDc2Ljk2LDEwbDIuMzEsMy41Qzc5LjI4LDEzLjUzLDc5LjI5LDEzLjU3LDc5LjI5LDEzLjYxeiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02My4wOSw5LjE2Yy0wLjM3LTEuNzktMS44Ny0zLjEyLTMuNjYtMy4xMmMtMC45OCwwLTEuOTMsMC40LTIuNiwxLjEyVjMuMzdjMC0wLjEyLTAuMS0wLjIyLTAuMjItMC4yMmgtMS4zM2MtMC4xMiwwLTAuMjIsMC4xLTAuMjIsMC4yMnYxMC4yMWMwLDAuMTIsMC4xLDAuMjIsMC4yMiwwLjIyaDEuMzNjMC4xMiwwLDAuMjItMC4xLDAuMjItMC4yMnYtMC43YzAuNjgsMC43MSwxLjYyLDEuMTIsMi42LDEuMTJjMS43OSwwLDMuMjktMS4zNCwzLjY2LTMuMTNDNjMuMjEsMTAuMyw2My4yMSw5LjcyLDYzLjA5LDkuMTZMNjMuMDksOS4xNnogTTU5LjEyLDEyLjQxYy0xLjI2LDAtMi4yOC0xLjA2LTIuMy0yLjM2VjkuOTljMC4wMi0xLjMxLDEuMDQtMi4zNiwyLjMtMi4zNnMyLjMsMS4wNywyLjMsMi4zOVM2MC4zOSwxMi40MSw1OS4xMiwxMi40MXoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjguMjYsNi4wNGMtMS44OS0wLjAxLTMuNTQsMS4yOS0zLjk2LDMuMTNjLTAuMTIsMC41Ni0wLjEyLDEuMTMsMCwxLjY5YzAuNDIsMS44NSwyLjA3LDMuMTYsMy45NywzLjE0YzIuMjQsMCw0LjA2LTEuNzgsNC4wNi0zLjk5UzcwLjUxLDYuMDQsNjguMjYsNi4wNHogTTY4LjI0LDEyLjQyYy0xLjI3LDAtMi4zLTEuMDctMi4zLTIuMzlzMS4wMy0yLjQsMi4zLTIuNHMyLjMsMS4wNywyLjMsMi4zOVM2OS41MSwxMi40MSw2OC4yNCwxMi40Mkw2OC4yNCwxMi40MnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTkuMTIsNy42M2MtMS4yNiwwLTIuMjgsMS4wNi0yLjMsMi4zNnYwLjA2YzAuMDIsMS4zMSwxLjA0LDIuMzYsMi4zLDIuMzZzMi4zLTEuMDcsMi4zLTIuMzlTNjAuMzksNy42Myw1OS4xMiw3LjYzeiBNNTkuMTIsMTEuMjNjLTAuNiwwLTEuMDktMC41My0xLjExLTEuMTlWMTBjMC4wMS0wLjY2LDAuNTEtMS4xOSwxLjExLTEuMTlzMS4xMSwwLjU0LDEuMTEsMS4yMVM1OS43NCwxMS4yMyw1OS4xMiwxMS4yM3oiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjguMjQsNy42M2MtMS4yNywwLTIuMywxLjA3LTIuMywyLjM5czEuMDMsMi4zOSwyLjMsMi4zOXMyLjMtMS4wNywyLjMtMi4zOVM2OS41MSw3LjYzLDY4LjI0LDcuNjN6IE02OC4yNCwxMS4yM2MtMC42MSwwLTEuMTEtMC41NC0xLjExLTEuMjFzMC41LTEuMiwxLjExLTEuMnMxLjExLDAuNTQsMS4xMSwxLjIxUzY4Ljg1LDExLjIzLDY4LjI0LDExLjIzeiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00My41Niw2LjI0aC0xLjMzYy0wLjEyLDAtMC4yMiwwLjEtMC4yMiwwLjIydjAuN2MtMC42OC0wLjcxLTEuNjItMS4xMi0yLjYtMS4xMmMtMi4wNywwLTMuNzUsMS43OC0zLjc1LDMuOTlzMS42OSwzLjk5LDMuNzUsMy45OWMwLjk5LDAsMS45My0wLjQxLDIuNi0xLjEzdjAuN2MwLDAuMTIsMC4xLDAuMjIsMC4yMiwwLjIyaDEuMzNjMC4xMiwwLDAuMjItMC4xLDAuMjItMC4yMlY2LjQ0YzAtMC4xMS0wLjA5LTAuMjEtMC4yMS0wLjIxQzQzLjU3LDYuMjQsNDMuNTcsNi4yNCw0My41Niw2LjI0eiBNNDIuMDIsMTAuMDVjLTAuMDEsMS4zMS0xLjA0LDIuMzYtMi4zLDIuMzZzLTIuMy0xLjA3LTIuMy0yLjM5czEuMDMtMi40LDIuMjktMi40YzEuMjcsMCwyLjI4LDEuMDYsMi4zLDIuMzZMNDIuMDIsMTAuMDV6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTM5LjcyLDcuNjNjLTEuMjcsMC0yLjMsMS4wNy0yLjMsMi4zOXMxLjAzLDIuMzksMi4zLDIuMzlzMi4yOC0xLjA2LDIuMy0yLjM2VjkuOTlDNDIsOC42OCw0MC45OCw3LjYzLDM5LjcyLDcuNjN6IE0zOC42MiwxMC4wMmMwLTAuNjcsMC41LTEuMjEsMS4xMS0xLjIxYzAuNjEsMCwxLjA5LDAuNTMsMS4xMSwxLjE5djAuMDRjLTAuMDEsMC42NS0wLjUsMS4xOC0xLjExLDEuMThTMzguNjIsMTAuNjgsMzguNjIsMTAuMDJ6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTQ5LjkxLDYuMDRjLTAuOTgsMC0xLjkzLDAuNC0yLjYsMS4xMlY2LjQ1YzAtMC4xMi0wLjEtMC4yMi0wLjIyLTAuMjJoLTEuMzNjLTAuMTIsMC0wLjIyLDAuMS0wLjIyLDAuMjJ2MTAuMjFjMCwwLjEyLDAuMSwwLjIyLDAuMjIsMC4yMmgxLjMzYzAuMTIsMCwwLjIyLTAuMSwwLjIyLTAuMjJ2LTMuNzhjMC42OCwwLjcxLDEuNjIsMS4xMiwyLjYxLDEuMTJjMi4wNywwLDMuNzUtMS43OCwzLjc1LTMuOTlTNTEuOTgsNi4wNCw0OS45MSw2LjA0eiBNNDkuNiwxMi40MmMtMS4yNiwwLTIuMjgtMS4wNi0yLjMtMi4zNlY5Ljk5YzAuMDItMS4zMSwxLjA0LTIuMzcsMi4yOS0yLjM3YzEuMjYsMCwyLjMsMS4wNywyLjMsMi4zOVM1MC44NiwxMi40MSw0OS42LDEyLjQyTDQ5LjYsMTIuNDJ6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTQ5LjYsNy42M2MtMS4yNiwwLTIuMjgsMS4wNi0yLjMsMi4zNnYwLjA2YzAuMDIsMS4zMSwxLjA0LDIuMzYsMi4zLDIuMzZzMi4zLTEuMDcsMi4zLTIuMzlTNTAuODYsNy42Myw0OS42LDcuNjN6IE00OS42LDExLjIzYy0wLjYsMC0xLjA5LTAuNTMtMS4xMS0xLjE5VjEwQzQ4LjUsOS4zNCw0OSw4LjgxLDQ5LjYsOC44MWMwLjYsMCwxLjExLDAuNTUsMS4xMSwxLjIxUzUwLjIxLDExLjIzLDQ5LjYsMTEuMjN6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTM0LjM2LDEzLjU5YzAsMC4xMi0wLjEsMC4yMi0wLjIyLDAuMjJoLTEuMzRjLTAuMTIsMC0wLjIyLTAuMS0wLjIyLTAuMjJWOS4yNGMwLTAuOTMtMC43LTEuNjMtMS41NC0xLjYzYy0wLjc2LDAtMS4zOSwwLjY3LTEuNTEsMS41NGwwLjAxLDQuNDRjMCwwLjEyLTAuMSwwLjIyLTAuMjIsMC4yMmgtMS4zNGMtMC4xMiwwLTAuMjItMC4xLTAuMjItMC4yMlY5LjI0YzAtMC45My0wLjctMS42My0xLjU0LTEuNjNjLTAuODEsMC0xLjQ3LDAuNzUtMS41MiwxLjcxdjQuMjdjMCwwLjEyLTAuMSwwLjIyLTAuMjIsMC4yMmgtMS4zM2MtMC4xMiwwLTAuMjItMC4xLTAuMjItMC4yMlY2LjQ0YzAuMDEtMC4xMiwwLjEtMC4yMSwwLjIyLTAuMjFoMS4zM2MwLjEyLDAsMC4yMSwwLjEsMC4yMiwwLjIxdjAuNjNjMC40OC0wLjY1LDEuMjQtMS4wNCwyLjA2LTEuMDVoMC4wM2MxLjA0LDAsMS45OSwwLjU3LDIuNDgsMS40OGMwLjQzLTAuOSwxLjMzLTEuNDgsMi4zMi0xLjQ5YzEuNTQsMCwyLjc5LDEuMTksMi43NiwyLjY1TDM0LjM2LDEzLjU5eiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MC4zMiwxMi45N2wtMC4wNy0wLjEyTDc4LjM4LDEwbDEuODUtMi44MWMwLjQyLTAuNjQsMC4yNS0xLjQ5LTAuMzktMS45MmMtMC4wMS0wLjAxLTAuMDItMC4wMS0wLjAzLTAuMDJjLTAuMjItMC4xNC0wLjQ4LTAuMjEtMC43NC0wLjIxaC0xLjUzYy0wLjUzLDAtMS4wMywwLjI4LTEuMywwLjc0bC0wLjMyLDAuNTNsLTAuMzItMC41M2MtMC4yOC0wLjQ2LTAuNzctMC43NC0xLjMxLTAuNzRoLTEuNTNjLTAuNTcsMC0xLjA4LDAuMzUtMS4yOSwwLjg4Yy0yLjA5LTEuNTgtNS4wMy0xLjQtNi45MSwwLjQzYy0wLjMzLDAuMzItMC42MiwwLjY5LTAuODUsMS4wOWMtMC44NS0xLjU1LTIuNDUtMi42LTQuMjgtMi42Yy0wLjQ4LDAtMC45NiwwLjA3LTEuNDEsMC4yMlYzLjM3YzAtMC43OC0wLjYzLTEuNDEtMS40LTEuNDFoLTEuMzNjLTAuNzcsMC0xLjQsMC42My0xLjQsMS40djMuNTdjLTAuOS0xLjMtMi4zOC0yLjA4LTMuOTctMi4wOWMtMC43LDAtMS4zOSwwLjE1LTIuMDIsMC40NWMtMC4yMy0wLjE2LTAuNTEtMC4yNS0wLjgtMC4yNWgtMS4zM2MtMC40MywwLTAuODMsMC4yLTEuMSwwLjUzYy0wLjAyLTAuMDMtMC4wNC0wLjA1LTAuMDctMC4wOGMtMC4yNy0wLjI5LTAuNjUtMC40NS0xLjA0LTAuNDVoLTEuMzJjLTAuMjksMC0wLjU3LDAuMDktMC44LDAuMjVDNDAuOCw1LDQwLjEyLDQuODUsMzkuNDIsNC44NWMtMS43NCwwLTMuMjcsMC45NS00LjE2LDIuMzhjLTAuMTktMC40NC0wLjQ2LTAuODUtMC43OS0xLjE5Yy0wLjc2LTAuNzctMS44LTEuMTktMi44OC0xLjE5aC0wLjAxYy0wLjg1LDAuMDEtMS42NywwLjMxLTIuMzQsMC44NGMtMC43LTAuNTQtMS41Ni0wLjg0LTIuNDUtMC44NGgtMC4wM2MtMC4yOCwwLTAuNTUsMC4wMy0wLjgyLDAuMWMtMC4yNywwLjA2LTAuNTMsMC4xNS0wLjc4LDAuMjdjLTAuMi0wLjExLTAuNDMtMC4xNy0wLjY3LTAuMTdoLTEuMzNjLTAuNzgsMC0xLjQsMC42My0xLjQsMS40djcuMTRjMCwwLjc4LDAuNjMsMS40LDEuNCwxLjRoMS4zM2MwLjc4LDAsMS40MS0wLjYzLDEuNDEtMS40MWMwLDAsMCwwLDAsMFY5LjM1YzAuMDMtMC4zNCwwLjIyLTAuNTYsMC4zNC0wLjU2YzAuMTcsMCwwLjM2LDAuMTcsMC4zNiwwLjQ1djQuMzVjMCwwLjc4LDAuNjMsMS40LDEuNCwxLjRoMS4zNGMwLjc4LDAsMS40LTAuNjMsMS40LTEuNGwtMC4wMS00LjM1YzAuMDYtMC4zLDAuMjQtMC40NSwwLjMzLTAuNDVjMC4xNywwLDAuMzYsMC4xNywwLjM2LDAuNDV2NC4zNWMwLDAuNzgsMC42MywxLjQsMS40LDEuNGgxLjM0YzAuNzgsMCwxLjQtMC42MywxLjQtMS40di0wLjM2YzAuOTEsMS4yMywyLjM0LDEuOTYsMy44NywxLjk2YzAuNywwLDEuMzktMC4xNSwyLjAyLTAuNDVjMC4yMywwLjE2LDAuNTEsMC4yNSwwLjgsMC4yNWgxLjMyYzAuMjksMCwwLjU3LTAuMDksMC44LTAuMjV2MS45MWMwLDAuNzgsMC42MywxLjQsMS40LDEuNGgxLjMzYzAuNzgsMCwxLjQtMC42MywxLjQtMS40di0xLjY5YzAuNDYsMC4xNCwwLjk0LDAuMjIsMS40MiwwLjIxYzEuNjIsMCwzLjA3LTAuODMsMy45Ny0yLjF2MC41YzAsMC43OCwwLjYzLDEuNCwxLjQsMS40aDEuMzNjMC4yOSwwLDAuNTctMC4wOSwwLjgtMC4yNWMwLjYzLDAuMywxLjMyLDAuNDUsMi4wMiwwLjQ1YzEuODMsMCwzLjQzLTEuMDUsNC4yOC0yLjZjMS40NywyLjUyLDQuNzEsMy4zNiw3LjIyLDEuODljMC4xNy0wLjEsMC4zNC0wLjIxLDAuNS0wLjM0YzAuMjEsMC41MiwwLjcyLDAuODcsMS4yOSwwLjg2aDEuNTNjMC41MywwLDEuMDMtMC4yOCwxLjMtMC43NGwwLjM1LTAuNThsMC4zNSwwLjU4YzAuMjgsMC40NiwwLjc3LDAuNzQsMS4zMSwwLjc0aDEuNTJjMC43NywwLDEuMzktMC42MywxLjM4LTEuMzlDODAuNDcsMTMuMzgsODAuNDIsMTMuMTcsODAuMzIsMTIuOTdMODAuMzIsMTIuOTd6IE0zNC4xNSwxMy44MWgtMS4zNGMtMC4xMiwwLTAuMjItMC4xLTAuMjItMC4yMlY5LjI0YzAtMC45My0wLjctMS42My0xLjU0LTEuNjNjLTAuNzYsMC0xLjM5LDAuNjctMS41MSwxLjU0bDAuMDEsNC40NGMwLDAuMTItMC4xLDAuMjItMC4yMiwwLjIyaC0xLjM0Yy0wLjEyLDAtMC4yMi0wLjEtMC4yMi0wLjIyVjkuMjRjMC0wLjkzLTAuNy0xLjYzLTEuNTQtMS42M2MtMC44MSwwLTEuNDcsMC43NS0xLjUyLDEuNzF2NC4yN2MwLDAuMTItMC4xLDAuMjItMC4yMiwwLjIyaC0xLjMzYy0wLjEyLDAtMC4yMi0wLjEtMC4yMi0wLjIyVjYuNDRjMC4wMS0wLjEyLDAuMS0wLjIxLDAuMjItMC4yMWgxLjMzYzAuMTIsMCwwLjIxLDAuMSwwLjIyLDAuMjF2MC42M2MwLjQ4LTAuNjUsMS4yNC0xLjA0LDIuMDYtMS4wNWgwLjAzYzEuMDQsMCwxLjk5LDAuNTcsMi40OCwxLjQ4YzAuNDMtMC45LDEuMzMtMS40OCwyLjMyLTEuNDljMS41NCwwLDIuNzksMS4xOSwyLjc2LDIuNjVsMC4wMSw0LjkxQzM0LjM3LDEzLjcsMzQuMjcsMTMuOCwzNC4xNSwxMy44MUMzNC4xNSwxMy44MSwzNC4xNSwxMy44MSwzNC4xNSwxMy44MXogTTQzLjc4LDEzLjU5YzAsMC4xMi0wLjEsMC4yMi0wLjIyLDAuMjJoLTEuMzNjLTAuMTIsMC0wLjIyLTAuMS0wLjIyLTAuMjJ2LTAuNzFDNDEuMzQsMTMuNiw0MC40LDE0LDM5LjQyLDE0Yy0yLjA3LDAtMy43NS0xLjc4LTMuNzUtMy45OXMxLjY5LTMuOTksMy43NS0zLjk5YzAuOTgsMCwxLjkyLDAuNDEsMi42LDEuMTJ2LTAuN2MwLTAuMTIsMC4xLTAuMjIsMC4yMi0wLjIyaDEuMzNjMC4xMS0wLjAxLDAuMjEsMC4wOCwwLjIyLDAuMmMwLDAuMDEsMCwwLjAxLDAsMC4wMlYxMy41OXogTTQ5LjkxLDE0Yy0wLjk4LDAtMS45Mi0wLjQxLTIuNi0xLjEydjMuNzhjMCwwLjEyLTAuMSwwLjIyLTAuMjIsMC4yMmgtMS4zM2MtMC4xMiwwLTAuMjItMC4xLTAuMjItMC4yMlY2LjQ1YzAtMC4xMiwwLjEtMC4yMSwwLjIyLTAuMjFoMS4zM2MwLjEyLDAsMC4yMiwwLjEsMC4yMiwwLjIydjAuN2MwLjY4LTAuNzIsMS42Mi0xLjEyLDIuNi0xLjEyYzIuMDcsMCwzLjc1LDEuNzcsMy43NSwzLjk4UzUxLjk4LDE0LDQ5LjkxLDE0eiBNNjMuMDksMTAuODdDNjIuNzIsMTIuNjUsNjEuMjIsMTQsNTkuNDMsMTRjLTAuOTgsMC0xLjkyLTAuNDEtMi42LTEuMTJ2MC43YzAsMC4xMi0wLjEsMC4yMi0wLjIyLDAuMjJoLTEuMzNjLTAuMTIsMC0wLjIyLTAuMS0wLjIyLTAuMjJWMy4zN2MwLTAuMTIsMC4xLTAuMjIsMC4yMi0wLjIyaDEuMzNjMC4xMiwwLDAuMjIsMC4xLDAuMjIsMC4yMnYzLjc4YzAuNjgtMC43MSwxLjYyLTEuMTIsMi42LTEuMTFjMS43OSwwLDMuMjksMS4zMywzLjY2LDMuMTJDNjMuMjEsOS43Myw2My4yMSwxMC4zMSw2My4wOSwxMC44N0w2My4wOSwxMC44N0w2My4wOSwxMC44N3ogTTY4LjI2LDE0LjAxYy0xLjksMC4wMS0zLjU1LTEuMjktMy45Ny0zLjE0Yy0wLjEyLTAuNTYtMC4xMi0xLjEzLDAtMS42OWMwLjQyLTEuODUsMi4wNy0zLjE1LDMuOTctMy4xNGMyLjI1LDAsNC4wNiwxLjc4LDQuMDYsMy45OVM3MC41LDE0LjAxLDY4LjI2LDE0LjAxTDY4LjI2LDE0LjAxeiBNNzkuMDksMTMuODFoLTEuNTNjLTAuMTIsMC0wLjIzLTAuMDYtMC4yOS0wLjE2bC0xLjM3LTIuMjhsLTEuMzcsMi4yOGMtMC4wNiwwLjEtMC4xNywwLjE2LTAuMjksMC4xNmgtMS41M2MtMC4wNCwwLTAuMDgtMC4wMS0wLjExLTAuMDNjLTAuMDktMC4wNi0wLjEyLTAuMTgtMC4wNi0wLjI3YzAsMCwwLDAsMCwwbDIuMzEtMy41bC0yLjI4LTMuNDdjLTAuMDItMC4wMy0wLjAzLTAuMDctMC4wMy0wLjExYzAtMC4xMSwwLjA5LTAuMiwwLjItMC4yaDEuNTNjMC4xMiwwLDAuMjMsMC4wNiwwLjI5LDAuMTZsMS4zNCwyLjI1bDEuMzQtMi4yNWMwLjA2LTAuMSwwLjE3LTAuMTYsMC4yOS0wLjE2aDEuNTNjMC4wNCwwLDAuMDgsMC4wMSwwLjExLDAuMDNjMC4wOSwwLjA2LDAuMTIsMC4xOCwwLjA2LDAuMjdjMCwwLDAsMCwwLDBMNzYuOTYsMTBsMi4zMSwzLjVjMC4wMiwwLjAzLDAuMDMsMC4wNywwLjAzLDAuMTFDNzkuMjksMTMuNzIsNzkuMiwxMy44MSw3OS4wOSwxMy44MUM3OS4wOSwxMy44MSw3OS4wOSwxMy44MSw3OS4wOSwxMy44MUw3OS4wOSwxMy44MXoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAsMS4yMWMtNC44NywwLTguODEsMy45NS04LjgxLDguODFzMy45NSw4LjgxLDguODEsOC44MXM4LjgxLTMuOTUsOC44MS04LjgxQzE4LjgxLDUuMTUsMTQuODcsMS4yMSwxMCwxLjIxeiBNMTQuMTgsMTIuMTljLTEuODQsMS44NC00LjU1LDIuMi02LjM4LDIuMmMtMC42NywwLTEuMzQtMC4wNS0yLTAuMTVjMCwwLTAuOTctNS4zNywyLjA0LTguMzljMC43OS0wLjc5LDEuODYtMS4yMiwyLjk4LTEuMjJjMS4yMSwwLDIuMzcsMC40OSwzLjIzLDEuMzVDMTUuOCw3LjczLDE1Ljg1LDEwLjUsMTQuMTgsMTIuMTl6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLDAuMDJjLTUuNTIsMC0xMCw0LjQ4LTEwLDEwczQuNDgsMTAsMTAsMTBzMTAtNC40OCwxMC0xMEMxOS45OSw0LjUsMTUuNTIsMC4wMiwxMCwwLjAyeiBNMTAsMTguODNjLTQuODcsMC04LjgxLTMuOTUtOC44MS04LjgxUzUuMTMsMS4yLDEwLDEuMnM4LjgxLDMuOTUsOC44MSw4LjgxQzE4LjgxLDE0Ljg5LDE0Ljg3LDE4LjgzLDEwLDE4LjgzeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNC4wNCw1Ljk4Yy0xLjc1LTEuNzUtNC41My0xLjgxLTYuMi0wLjE0QzQuODMsOC44Niw1LjgsMTQuMjMsNS44LDE0LjIzczUuMzcsMC45Nyw4LjM5LTIuMDRDMTUuODUsMTAuNSwxNS44LDcuNzMsMTQuMDQsNS45OHogTTExLjg4LDkuODdsLTAuODcsMS43OGwtMC44Ni0xLjc4TDguMzgsOS4wMWwxLjc3LTAuODZsMC44Ni0xLjc4bDAuODcsMS43OGwxLjc3LDAuODZMMTEuODgsOS44N3oiLz48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEzLjY1LDkuMDEgMTEuODgsOS44NyAxMS4wMSwxMS42NSAxMC4xNSw5Ljg3IDguMzgsOS4wMSAxMC4xNSw4LjE1IDExLjAxLDYuMzcgMTEuODgsOC4xNSAiLz48L2c+PC9zdmc+);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 65px 20px;
  }


  @media (max-width: 500px), (max-height: 500px) {
    .mapbox-attribution-container {
      font-size: 9px;
      padding: 3px;
    }
    .mapbox-attribution-container .sozialhelden-logo-container {
      display: none;
    }
    .mapbox-wordmark {
      left: 0;
      bottom: 0;
      left: constant(safe-area-inset-left);
      left: env(safe-area-inset-left);
      bottom: constant(safe-area-inset-bottom);
      bottom: env(safe-area-inset-bottom);
      margin-left: 5px;
      margin-bottom: 3px;
    }
  }
`;

export default MapStyle;
