/**
 * @fileOverView Gruntfile
 * @author zhangmeng on 16/2/12
 */

module.exports = grunt => {
    //This module will read the dependencies/devDependencies/peerDependencies/optionalDependencies in your package.json
    // and load grunt tasks that match the provided patterns.
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        concurrent: {
            protractor_test: ['protractor-chrome', 'protractor-firefox', 'protractor-safari']
        },
        protractor: {
            options: {
                keepAlive: true,
                singleRun: false,
                configFile: "conf.js"
            },
            run_chrome: {
                options: {
                    args: {
                        browser: "chrome"
                    }
                }
            },
            run_firefox: {
                options: {
                    args: {
                        browser: "firefox"
                    }
                }
            },
            run_safari: {
                options: {
                    args: {
                        browser: "safari"
                    }
                }
            }
        }
    });

// tasks of target1 run concurrently, after they all finished, tasks of target2 run concurrently,
// instead of target1 and target2 run concurrently.
    grunt.registerTask('protractor-chrome', ['protractor:run_chrome']);
    grunt.registerTask('protractor-firefox', ['protractor:run_firefox']);
    grunt.registerTask('protractor-safari', ['protractor:run_safari']);
    grunt.registerTask('protractor-e2e', ['concurrent:protractor_test']);
};
