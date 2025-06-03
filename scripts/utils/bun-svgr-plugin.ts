import { plugin } from "bun";
import * as svgrOptions from "../../svgr.config.js";

/**
 * Loads SVG files as React components using SVGR.
 * https://github.com/oven-sh/bun/issues/3673#issuecomment-1735840376
 */
plugin({
  name: "SVG",
  async setup(build) {
    const { transform } = await import("@svgr/core");
    const { readFileSync } = await import("node:fs");

    build.onLoad({ filter: /\.(svg)$/ }, async (args) => {
      const text = readFileSync(args.path, "utf8");
      const contents = await transform(
        text,
        {
          ...svgrOptions,
          typescript: false,
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        },
        { componentName: "ReactComponent" },
      );

      return {
        contents,
        loader: "js",
      };
    });
  },
});
