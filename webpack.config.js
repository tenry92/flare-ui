const path = require('path');

const pkg = require('./package.json');

const prefix = pkg.config.prefix;

module.exports = {
  mode: process.env.MODE || 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html?$/i,
        loader: 'html-loader',
        options: {
          preprocessor: (content, context) => {
            return content.replace(/_prefix_/g, prefix);
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'flare-ui.js',
    path: path.resolve(__dirname, 'dist'),
    library: pkg.config.library,
    libraryTarget: 'window',
  },
};
