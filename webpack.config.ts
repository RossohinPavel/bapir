import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';


const filename = `${process.env.npm_package_name}-${process.env.npm_package_version}.js`;


const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        app: path.resolve(__dirname, './src/app.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: filename,
        libraryTarget: 'umd',
        // iife: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                    mangle: false,
                    keep_classnames: true,
                    keep_fnames: true
                }
            }),
        ]
    }
};


export default config;