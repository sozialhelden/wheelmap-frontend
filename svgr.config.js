module.exports = {
  typescript: true,
  ext: "tsx",
  ref: true,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            removeUselessStrokeAndFill: false,
          },
        },
      },
    ],
  },
};
