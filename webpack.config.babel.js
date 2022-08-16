import path from 'path';
import dotenv from 'dotenv';
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin';
import DotenvPlugin from 'webpack-dotenv-plugin';

const {NODE_ENV} = process.env;
const isDevelopment = NODE_ENV === 'development';

dotenv.config({
  path: '.env.local',
});

export default {
  mode: isDevelopment ? 'development' : 'production',
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
      outDir: "../../packages/glyph/pkg",
      outName: "use_gpu_text",
      forceMode: "production",
    }),
    new DotenvPlugin({
        path: '.env.local',
        sample: '.env.local.example',
        allowEmptyValues: true,
    }),
  ],
  experiments: {
    syncWebAssembly: true,
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
    host: '0.0.0.0',
    port: 8777,
    historyApiFallback: true,
  }
};
