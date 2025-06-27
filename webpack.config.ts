import path from 'path';
import webpack from 'webpack';


const dirname = process.cwd();
const filename = `${process.env.npm_package_name}-${process.env.npm_package_version}.js`;


const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        app: path.resolve(dirname, './src/app.ts'),
    },
    output: {
        path: path.resolve(dirname, './dist'),
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