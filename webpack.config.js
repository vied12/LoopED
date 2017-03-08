var webpack = require('webpack');
module.exports = {
    entry: [
        "fastclick",
        "whatwg-fetch",
        "./js/app.js"
    ],
    output: {
        path: __dirname + '/static',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: { presets: ['es2015', 'react', 'stage-2'] },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ config: { HOST: JSON.stringify(process.env.HOST) } })
    ]
};
