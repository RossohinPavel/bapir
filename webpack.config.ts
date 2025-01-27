import path from 'path';
import webpack from 'webpack';


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
};


export default config;