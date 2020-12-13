import path from 'path';

export default {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/build/',
        filename: 'use.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    devServer: {
      publicPath: '/build/',
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      port: 8777,
    }
};