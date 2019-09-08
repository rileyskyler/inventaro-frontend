const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = env => {
  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "/dist"),
      filename: "index_bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new webpack.DefinePlugin({ API_URL: JSON.stringify(env.API_URL) })
    ]
  };
};
