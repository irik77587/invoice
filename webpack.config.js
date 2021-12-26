const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    fallback: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
      process: require.resolve("process/browser"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
      buffer: require.resolve("buffer"),
      asset: require.resolve("assert"),
    }
  },
  output: {
    path: path.resolve(__dirname, "./docs"),
    filename: "bundle.js",
  },
  // [webpack-dev-server] "hot: true" automatically applies HMR plugin, you don't have to add it manually to your webpack configuration.
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    // contentBase is deprecated by static in webpack v5
    contentBase: path.resolve(__dirname, "./docs"),
    hot: true,
  },
};
