module.exports = {
  entry: "./main.js",
  output: {
    path: __dirname + '/public',
    filename: "bundle.js",
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ],
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-es2015']
          }
        }
      }
    ]
  }
};  