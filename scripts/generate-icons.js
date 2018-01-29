import fs from 'fs';
import mkdirp from 'mkdirp';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as icons from '../src/components/icons/categories';
import * as markers from '../src/components/icons/markers';

export default function MergedSVGIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25px" height="25px" {...props}>
    {props.children[0].type().props.children}
    <g transform="translate(5 5)" id="icon">
      {React.Children.map(props.children[1].type().props.children, child => <child.type {...child.props} fill="white">{child.props.children}</child.type>)}
    </g>
  </svg>;
}

mkdirp.sync('build/icons');

const resultHTML = [`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Icon overview</title>
  <style>
    img {
      width: 25px;
      height: 25px;
    }
  </style>
</head>
<body>`];

Object.keys(markers).forEach(markerName => {
  const Marker = markers[markerName];
  Object.keys(icons).forEach(iconName => {
    const Icon = icons[iconName];

    function MergedIcon() {
      return (<MergedSVGIcon id={`${iconName}-${markerName}`}>
        <Marker />
        <Icon />
      </MergedSVGIcon>);
    }

    const svg = ReactDOMServer.renderToStaticMarkup(<MergedIcon />);
    const fileName = `${iconName}-${markerName}.svg`;
    fs.writeFile(`build/icons/${fileName}`, svg);
    // console.log(svg, '\n');
    resultHTML.push(`<img src="./${fileName}">`);
  });
});

resultHTML.push('</body></html>');
fs.writeFile('build/icons/index.html', resultHTML.join('\n'));