let UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
    entry: ['babel-polyfill','./src/js/app.js'],
    output: {
        path: __dirname + '/dest/static',
        filename: 'bundle.js'
    },
    module: {
    	rules: [
    		{
    			test: /\.js$/,
    			loader: 'babel-loader',
    			exclude: /node_modules/,
    			options: {
    				"presets": ["es2015"]
    			}
    		}
    	]
    },
    plugins: [
        new UglifyJsPlugin({
    		beautify: false,
    		mangle: { screw_ie8 : true },
    		compress: { screw_ie8: true, warnings: false },
    		comments: false
    	})
    ]
};
