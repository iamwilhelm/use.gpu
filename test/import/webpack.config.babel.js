import path from 'path';

export default {
  mode: 'development',
  entry: {
    app: {
      import: './src/import-tests.ts',
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'import.bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json', '.wgsl']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
      {
        test: /\.wgsl$/i,
        use: ['@use-gpu/wgsl-loader'],
      },
    ],
  },
  devtool: false,
};
