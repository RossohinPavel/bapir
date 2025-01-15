import path from 'path';
import webpack from 'webpack';


const devMode = process.env.node_env === 'development';

let filename = `${process.env.npm_package_name}-${process.env.npm_package_version}`;
filename += devMode ? '.d' : '';


const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        app: path.resolve(__dirname, './src/app.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: `${filename}.js`,
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


if ( devMode ) {
    // config.output.libraryTarget = undefined;
    config.optimization = {
        // minimize: false,
        // sideEffects: false,
    };
    // config.output.iife = false;
};


export default config;