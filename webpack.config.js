module.exports = {
  output: {
    library: 'Simplemark',
    libraryTarget: 'umd',
  },

  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
};
