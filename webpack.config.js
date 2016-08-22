let path = require('path');
let webpack = require('webpack');
let CopyWebpackPlugin = require('copy-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
console.log('Building for production?', IS_PRODUCTION ? 'yes' : 'no');

let plugins = [
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'src/index.html'),
      to: path.resolve(__dirname, 'dist/'),
    },
  ]),
];

module.exports = {
  entry: {
    'index': ['./src/index.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    // library: true,
    // libraryTarget: 'web',
  },
  externals: {
    // require('jquery') is external and available
    //  on the global var jQuery
    jquery: 'jQuery',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        // Only run `.js` and `.jsx` files through Babel
        test: /\.js$/,
        loader: 'babel',
        query: {
          // this is a bugfix for exports.default (view npm readme)
          plugins: ['add-module-exports'],
          // plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0'],
        },
        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, 'src'),
        ],
      },
    ],
  },
  plugins: IS_PRODUCTION ? plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
  ]) : plugins,
};
