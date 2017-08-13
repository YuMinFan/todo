var gulp = require('gulp');	//引入gulp
var plugins = require('gulp-load-plugins')();	//加载package.json里的gulp插件
var open = require('open');

/*------------压缩复制html------------*/
gulp.task('copyHtml',function(){
	gulp.src('src/*.html')			//读取html
		.pipe(gulp.dest('build/'))	//复制到开发环境
		.pipe(plugins.minifyHtml())	//压缩html
		.pipe(gulp.dest('dev/'))	//复制到生产环境
		.pipe(plugins.connect.reload());
})
/*------------合并压缩js------------*/
gulp.task('mergeJs',function(){
	gulp.src('src/js/*.js')
		.pipe(plugins.concat('index.js'))//合并后的文件index.js
		.pipe(gulp.dest('build/js/'))	 
		.pipe(plugins.uglify())			 //压缩js
		.pipe(gulp.dest('dev/js/'))
		.pipe(plugins.connect.reload());

})
/*------------压缩复制css------------*/
gulp.task('copyCss',function(){
	gulp.src('src/css/*.css')
		.pipe(gulp.dest('build/css/'))
		.pipe(plugins.cssmin())
		.pipe(gulp.dest('dev/css/'))
		.pipe(plugins.connect.reload());

	
})


/*------------删除文件夹------------*/
gulp.task("clear",function () {
    gulp.src(["dev/","build/"])
        .pipep(plugins.clean());
});


/*------------lib------------*/
gulp.task("lib",function () {
    gulp.src("bower_components/**/dist/*.js")
        .pipe(gulp.dest("build/lib/"))
        .pipe(gulp.dest("dev/lib/"));
    gulp.src('node_modules/todomvc-app-css/*.css')
		.pipe(gulp.dest('build/lib/'));
	gulp.src('node_modules/todomvc-common/*.css')
		.pipe(gulp.dest('build/lib/'));
	gulp.src('node_modules/todomvc-common/*.js')
		.pipe(gulp.dest('build/lib/'));
});

/*------------总的任务------------*/
gulp.task('build',['copyHtml','copyCss','lib','mergeJs','copyCss'])

/*------------自动刷新，自动打开------------*/
gulp.task('server',function(){
	plugins.connect.server({
		root:'build/',
		prot:8080,
		livereload:true
	});
	open('http://localhost:8080');

	gulp.watch('src/*.html',['copyHtml']);
	gulp.watch('src/js/*.js',['mergeJs']);
	gulp.watch('src/css/*.css',['copyCss']);

})
/*------------默认任务------------*/
gulp.task('default',['server']);

