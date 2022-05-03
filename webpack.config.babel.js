import path from 'path';
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin';

const {NODE_ENV} = process.env;
const isDevelopment = NODE_ENV === 'development';

export default {
  mode: 'development',
  entry: {
    app: {
      import: './packages/app/src/index.tsx',
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
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, 'rust/use-gpu-text'),
      outDir: "../../packages/text/pkg",
      outName: "use-gpu-text",
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
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
        test: /\.wgsl$/i,
        use: [path.resolve('./packages/wgsl-loader/src/index.ts')],
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
    historyApiFallback: true,
  }
};
