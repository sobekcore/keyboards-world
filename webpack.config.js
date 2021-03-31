const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: {
    main: "./src/javascript/index.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "./index.html",
      favicon: "./src/assets/favicon.ico"
    }),
    new HtmlWebpackPlugin({
      template: "./about/index.html",
      filename: "./about/index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./store/index.html",
      filename: "./store/index.html",
    }),
    new webpack.EnvironmentPlugin([
      "CONTENTFUL_SPACE_ID",
      "CONTENTFUL_ACCES_TOKEN"
    ])
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\-url.(jpg|png)$/,
        loader: "url-loader"
      }
    ]
  }
}
