import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Dotenv from 'dotenv-webpack';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

export default {
  mode: process.env.NODE_ENV,
  entry: './client/index.js',
  output: {
    path: path.resolve(path.dirname(__filename), 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [`@babel/preset-env`, `@babel/preset-react`],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader', // post process the compiled CSS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devServer: {
    static: {
      directory: path.join(path.dirname(__filename), 'public'),
    },
    compress: true,
    port: 8080,
    //proxy allows us to mimic localhost 3000 requests
    //the server by default does not respond to 8080
    proxy: {
      '/Api': {
        target: 'http://localhost:8080',
        router: () => 'http://localhost:3000',
        logLevel: 'debug',
      },
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' }), new Dotenv()],
};
