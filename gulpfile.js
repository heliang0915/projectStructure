var gulp = require('gulp');
var path=require('path');
// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩
    uglify = require('gulp-uglify'),//js压缩
    minifyHtml = require('gulp-minify-html'),//html压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息

var sourcePathPrefix = 'assets';
var devResPath='dev/'+sourcePathPrefix;
var viewsPath = 'dev/views';
var destPath='release/'+sourcePathPrefix;
var destViewPath='release/views';
// var replacHtml=require('replace-html');
//var rep=new replacHtml(path.join(__dirname,destViewPath),sourcePathPrefix,destPath);

gulp.task('js', function () {
     gulp.src(devResPath + '/js/*.js')
        // .pipe(concat('all.js'))
        .pipe(gulp.dest(destPath+'/js'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify({
          mangle:true
        }))
        .pipe(gulp.dest(destPath+'/js'))
        .pipe(notify({message: 'js min ok!!!'}));
});

gulp.task('css', function () {
    return gulp.src(devResPath +'/css/*.css')
        // .pipe(concat('main.css'))
        .pipe(gulp.dest(destPath+'/css'))
       // .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(destPath+'/css'))
        .pipe(notify({message: 'css min ok !!!'}));
});

gulp.task('images', function () {
    return gulp.src(devResPath+'/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(destPath+'/images/'))
        .pipe(notify({message: 'img min ok !!!'}));
});
gulp.task('html', function () {
      return gulp.src(viewsPath+'/*')
          .pipe(minifyHtml())
          .pipe(gulp.dest(destViewPath+'/'))
          .pipe(notify({message: 'html min ok !!!'}));
});
gulp.task('all',['js', 'css', 'images','html','watch']);

//监控
gulp.task('watch', function () {
    gulp.watch(devResPath + '/js/*.js',['js']);
    //监控css
    gulp.watch(devResPath + '/css/*.css', ['css']);
    //监控images
    gulp.watch(devResPath + '/images/*',['images']);
    //监控html
    gulp.watch(viewsPath + '/*.html',['html']);
})

gulp.task('default', ['all']);
