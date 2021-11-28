import path from 'path';

export default {
  mode: 'development',
  entry: {
    app: {
      import: './import-tests.ts',
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'import.bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json', '.glsl']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
      {
        test: /\.glsl$/i,
        use: ['@use-gpu/glsl-loader'],
      },
    ],
  },
  devtool: false,
};
