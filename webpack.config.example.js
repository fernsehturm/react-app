const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
    IP_ADDR,
    NODE_ENV = "production",
    DOMAIN = "test.com",
    APP_SUBDOMAIN = "app",
    APP_NAME = "app",
    WEB_NAME = "web", 
    EXAMPLE_API_PORT = 8032
} = process.env;


module.exports = {
    context: path.resolve(__dirname, 'example'),
    entry: {
        /**
         * The key of this object ('app') serves as the [name] placeholder in the output
         */
        [APP_NAME]: './App.tsx',
        [WEB_NAME]: './Web.tsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),

        /**
         * The public path is the relative path from the url where the `bundle.js` will be found
         * The publicPath is required of partly-bundles created through async-components
         */
        publicPath: '/',
    },
    mode: NODE_ENV,
    target: 'web',
    /**
     * CAUTION! When only building, it hangs for NODE_ENV===development
     */
    watch: NODE_ENV == 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        /**
         * enable the `tsconfig.json`-aliases as described [here](https://medium.com/@rossbulat/typescript-working-with-paths-packages-and-yarn-workspaces-6fbc7087b325)
         * [See this](https://www.npmjs.com/package/tsconfig-paths-webpack-plugin)
         */
        plugins: [
        ],
        /** the path to the shared modules depends on the environment */
        alias: {
            
        } 
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: NODE_ENV !== 'development'
    },
    devtool: 'source-map',
    
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                //exclude: [/node_modules/],
                // must not exclude my own library because this is the original tsx
                exclude: /node_modules\/(?!(@fernsehturm)\/).*/,
                /*include: [
                    path.resolve(__dirname),
                    path.resolve(__dirname, "../types")
                ],*/
                use: [{
                    loader: 'babel-loader',                    
                    options: {
                        presets: [
                            /**
                             * we use typescript
                             */
                            '@babel/preset-typescript',

                            /**
                             * the general environment
                             */
                            '@babel/preset-env',

                            /**
                             *  we use react
                             */
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-syntax-class-properties',
                            '@babel/plugin-proposal-class-properties',
                            'babel-plugin-transform-async-to-promises',
                            [ '@babel/plugin-proposal-decorators', {"legacy": true } ],
                        ]
                    }
                }],
            },
            //loaders for other file types can go here
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false, // do not insert the React script automatically. Because we add it manually
            template: path.join(__dirname, "example", "index.html"),
            nodeEnv: NODE_ENV,
            domain: DOMAIN,
            appSubdomain: APP_SUBDOMAIN,
            appName: APP_NAME,
            webName: WEB_NAME,
            apiExample: `${IP_ADDR}:${EXAMPLE_API_PORT}`
        }),

    ],
    devServer: {
        static: { 
          directory: path.resolve(__dirname, './dist'), 
          publicPath: '/'
        }
      }
};