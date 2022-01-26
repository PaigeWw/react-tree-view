const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        exclude: "/node_modules/",
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-react"] },
          },
          { loader: "ts-loader" },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  //   mode: "production",
};
