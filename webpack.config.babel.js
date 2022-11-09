import path from 'path';
import dotenv from 'dotenv';
import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin';
import DotenvPlugin from 'webpack-dotenv-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';

dotenv.config({
  path: '.env.local',
});

export default {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    // Hot reload client
    use: isDevelopment ? [
      './packages/app/src/index.tsx',
      'webpack-dev-server/client/index.js?hot=true&live-reload=true'
    ] : ['./packages/app/src/index.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: isDevelopment ? '/dist/' : '/demo/dist/',
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, 'rust/use-gpu-text'),
      outDir: path.resolve(__dirname, 'packages/glyph/pkg'),
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // Ensure components remain readable in inspector
          keep_fnames: true,
        },
      }),
    ],
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
    hot: true,
  }
};
