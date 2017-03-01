/**
 * Base webpack configuration with options used by the development and
 *      production configurations.
 */

/* External dependencies */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'client'),
        publicPath: '/',
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /(\.css)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
                publicPath: '/client'
            }),
        }, {
            test: /\.html$/,
            use: 'html-loader',
        }, {
            test: /\.(eot|svg|ttf|woff|woff2|jpg|png|gif|ico)$/,
            use: 'file-loader',
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename: 'styles.css',
            disable: false,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            children: true,
            minChunks: 2,
            async: true,
        }),
    ],
    resolve: {
        modules: [
            path.join(process.cwd(), 'src'),
            'node_modules',
        ],
        extensions: ['.js', '.jsx', '.css'],
        alias: {
            containers: path.resolve(process.cwd(), 'src/containers'),
            types: path.resolve(process.cwd(), 'internals/flow'),
        },
    },
    target: 'web',
};
