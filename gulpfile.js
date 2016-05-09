var gulp = require('gulp');
// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息

var resPath = 'assets';
var viewsPath = 'views';
var destPath='release';

var replacHtml=require('replace-html');
var rep=new replacHtml(__dirname+'/views',resPath,destPath);
rep.run();

gulp.task('js', function () {
     gulp.src(resPath + '/js/*.js')
        // .pipe(concat('all.js'))
        .pipe(gulp.dest(destPath+'/js'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(destPath+'/js'))
        .pipe(notify({message: 'js min ok!!!'}));
});

gulp.task('css', function () {
    //console.log("压缩css");
    return gulp.src(resPath +'/css/*.css')
        // .pipe(concat('main.css'))
        .pipe(gulp.dest(destPath+'/css'))
       // .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(destPath+'/css'))
        .pipe(notify({message: 'css min ok !!!'}));
});

gulp.task('images', function () {
    return gulp.src(resPath+'/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(destPath+'/images/'))
        .pipe(notify({message: 'img min ok !!!'}));
});

 
gulp.task('all',['js', 'css', 'images', 'watch']);

//监控
gulp.task('watch', function () {
    gulp.watch(resPath + '/js/*.js',['js']);
    //监控css
    gulp.watch(resPath + '/css/*.css', ['css']);
    //监控images
    gulp.watch(resPath + '/images/*',['images']);
    //监控html
    gulp.watch(viewsPath + '/*.html', function () {
        //rep.run();        
    });
})

gulp.task('default', ['all']);



