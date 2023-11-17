/**
 * We use the Javascript conifguration format because it allows us to
 * document it.
 * 
 * see {@link https://babeljs.io/docs/en/configuration#javascript-configuration-files}
 */
module.exports = function (api) {
    api.cache(true);
  
    const presets = [
        /**
         * Babel works based on plugins. You have plugins which convert arrow functions,
         * spread syntax etc. to the given environment. But to simplify things babel gathers
         * related plugins into  presets. The most popular preset is an “env” preset. It
         * contains all the features from the latest ECMAScript standard.
         * 
         * Along with the preset, you can pass some options. So let’s define that babel should transpile
         * code to node version 8. In order to do that we have to wrap the preset into an array
         * and as a second element pass the JSON object with `targets` property
         */
        [
            "@babel/preset-env", {
                targets: {"node": 8 }
            }
        ],
        /**
         * enable Babel to compile Typescript into Javascript
         */
        "@babel/preset-typescript",

        /**
         * We require this preset to work with MDX
         */
        "@babel/preset-react"
    ];
    const plugins = [
        /*["module-resolver", {
            "shared": ["./shared/"]
        }]*/
        
    ];

    const env = {
        /*test: {
          "plugins": ["require-context-hook"]
        }*/
    };

    const ignore = [
        /node_modules/,
    ];
  
    return {
        presets,
        plugins,
        env,
        ignore
    };
  }