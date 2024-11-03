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
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[name][ext][query]',
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
