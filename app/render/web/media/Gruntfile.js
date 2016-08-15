module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['js/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['css/**/*.css'],
                tasks: ['concat', 'cssmin'],
                options: {
                    spawn: false,
                },
            }
        },
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                //separator: ';\n'
                separator: ';\n'
            },
            dist: {
                // 将要被合并的文件
                src: ['js/**/*.js'],
                // 合并后的JS文件的存放位置
                dest: 'dist/<%= pkg.name %>.js'
            },
            options: {
            },
            css: {
                src: ['css/**/*.css'],//当前grunt项目中路径下的src/css目录下的所有css文件
                dest: 'dist/all.css'  //生成到grunt项目路径下的dist文件夹下为all.css  
            }
        },
        uglify: {
            options: {
                mangle: false, //不混淆变量名
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },
        cssmin: { //css文件压缩  
            css: {
                src: 'dist/all.css',//将之前的all.css  
                dest: 'dist/all.min.css'  //压缩  
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);

};