import webpack from 'webpack';
import path from 'path';

const isDevelopment = (process.env.NODE_ENV !== 'production');

const baseConfig = {
    debug: (isDevelopment),
    noInfo: (!isDevelopment),
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'client'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loaders: ['babel']
        }, {
            test: /(\.css)$/,
            loaders: ['style', 'css']
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file'
        }, {
            test: /\.(woff|woff2)$/,
            loader: 'url?prefix=font/&limit=5000'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=image/svg+xml'
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
    ],
    resolve: {
        root: path.resolve(__dirname, 'src'),
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
        extensions: ['', '.js', ],
    }
};

const developmentConfig = {
    devtool: 'inline-source-map',
    entry: [
        './src/index.js',
        'webpack/hot/dev-server',
        `webpack-dev-server/client?http://localhost:${process.env.PORT}/`,
    ],
    plugins: baseConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ])
};

const productionConfig = {
    devtool: 'source-map',
    entry: './src/index',
    plugins: baseConfig.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the React library size:
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
            },
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi] // Skip pre-minified libs
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    ]),
};

const configToUse = isDevelopment ?
    developmentConfig :
    productionConfig;

export default Object.assign({}, baseConfig, configToUse);
