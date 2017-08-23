// Gruntfile.js
(function(){
	'use strict';
	module.exports = grunt => {
		// load all grunt tasks
		require('load-grunt-tasks')(grunt);
		const Webpack_Config = require('./webpack.config');
		const Grunt_Config = {
			sass: {
				dev: {
					options: {
						style: {
							style: 'expanded',
							sourceMap: true
						}
					},
					files: {
						'./dest/static/style.css': './src/scss/style.scss'
					}
				},
				prod: {
					options: {
						style: 'compact',
						sourceMap: false
					},
					files: {
						'./build/static/style.css': './src/scss/style.scss'
					}
				}
			},
			webpack: {
				options: {
					stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
				},
				prod: Webpack_Config,
				dev: Object.assign({watch: true}, Webpack_Config)
			},
			cssmin: {
				options: {
					mergeIntoShorthands: false,
					roundingPrecision: -1
				},
				target: {
					files: {
						'./build/static/style.min.css': ['build/static/style.css']
					}
				}
			},
			copy: {
				main: {
					expand: true,
					cwd: 'dest',
					src: '**',
					dest: 'build/'
				}
			},
			watch: {
				scripts: {
					files: ["./src/scss/*.scss"],
					tasks: ["sass:dev"]
				}
			}
		};

		grunt.initConfig(Grunt_Config);
		grunt.registerTask('default', ['watch']);
		grunt.registerTask('sass_dev', ['sass:dev']);
		grunt.registerTask('webpackdev', ['webpack']);
		grunt.registerTask('build', ['copy', 'cssmin']);
	};
}());
