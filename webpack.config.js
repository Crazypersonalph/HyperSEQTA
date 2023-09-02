const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'production',
  performance: {
    hints: false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './public/manifest.json', to: './' },
        { from: './public/icons/', to: './icons/' },
        { from: './public/preview/', to: './inject/preview/' },
        { from: './public/popup/', to: './popup/' }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js'
      }]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  entry: {
    seqta: './src/SEQTA.js',
    background: './src/background.js',
    'inject/documentload': './src/inject/documentload.css',
    'inject/iframe': './src/inject/iframe.css',
    'inject/injected': './src/inject/injected.css',
    'inject/noticeiframe': './src/inject/noticeiframe.css'
  },
  output: {
    filename: (pathData) => {
      const name = pathData.chunk.name.replace('inject-', '')
      return name.includes('inject') ? `inject/${name}.js` : `${name}.js`
    },
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }
        ]
      }
    ]
  }
}
