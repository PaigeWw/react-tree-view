const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./example/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "example/dist"),
    filename: "[name].js",
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "./example/index.html",
      chunks: ["app"],
      filename: "index.html",
    }),
  ],
  devServer: {
    port: 3335,
  },
  mode: "development",
};
