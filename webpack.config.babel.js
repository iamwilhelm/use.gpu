import path from 'path';

const {NODE_ENV} = process.env;
const isDevelopment = NODE_ENV === 'development';

export default {
  entry: {
    app: {
      import: './packages/app/src/index.ts',
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'use.bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json']
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
        use: [path.resolve('./packages/glsl-loader/src/index.ts')],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: isDevelopment ? 'eval-source-map' : false,
  devServer: {
    publicPath: '/dist/',
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8777,
  }
};
