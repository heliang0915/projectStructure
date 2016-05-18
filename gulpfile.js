var gulp = require('gulp');
var path=require('path');
var fs=require('fs');
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

gulp.task('font',function(){
  return gulp.src(devResPath+'/font/*')
        .pipe(gulp.dest(destPath+'/font/'))
        .pipe(notify({message: 'font  ok !!!'}));
});

//拷贝weight
gulp.task('weight',function(){
  return gulp.src(devResPath+'/weight/*/*.js')
        .pipe(uglify({
          mangle:true
        }))
        .pipe(gulp.dest(destPath+'/weight/'))
        .pipe(notify({message: 'weight  ok !!!'}));
})

//拷贝libs
gulp.task('libs',function(){
  return gulp.src('dev/libs/*')
          .pipe(uglify({
            mangle:true
          }))
        .pipe(gulp.dest('release/libs/'))
        .pipe(notify({message: 'libs  ok !!!'}));
})

gulp.task('updateBoot',['libs'],function () {
  var bootJS='release/libs/boot.js';
    fs.readFile(bootJS,function(err,data){
        // console.log('data>>'+data);
        if(err){
            console.log("boot.js替换失败"+err);
        }else{
          var jsStr=data.toString();
          jsStr=jsStr.replace('isDev=!','isDev=');
          fs.writeFile(bootJS,jsStr,function(err){
              if(err){
                console.log("写入失败:"+err);
              }
          });

        }
      })
})


gulp.task('all',['js', 'css', 'images','html','font','weight','libs','updateBoot','watch']);

//监控
gulp.task('watch', function () {
    //监控js
    gulp.watch(devResPath + '/js/*.js',['js']);
    //监控weight
    gulp.watch(devResPath+'/weight/*/*.js',['weight','updateBoot']);
    //监控css
    gulp.watch(devResPath + '/css/*.css', ['css']);
    //监控images
    gulp.watch(devResPath + '/images/*',['images']);
    // 监控字体
    gulp.watch(devResPath + '/font/*',['font']);
    //监控html
    gulp.watch(viewsPath + '/*.html',['html']);
})
gulp.task('default', ['all']);
