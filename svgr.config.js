const path = require("node:path");

const template = (variables, { tpl }) => tpl`
${variables.imports};

${variables.interfaces};

export const ${variables.componentName} = forwardRef(
  (${variables.props}) => (
    ${variables.jsx}
  )
);
`;

const indexTemplate = (filePaths) => {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath));
    const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename;
    return `export { ${exportName} } from './${basename}'`;
  });
  return exportEntries.join("\n");
};

module.exports = {
  icon: true,
  expandProps: true,
  typescript: true,
  ref: true,
  replaceAttrValues: {
    "#fff": "currentColor",
    "#ffffff": "currentColor",
    "#000": "currentColor",
    "#000000": "currentColor",
  },
  template,
  indexTemplate,
};
