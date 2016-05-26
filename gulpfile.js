var gulp = require('gulp');
var path=require('path');
var fs=require('fs');
// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    amdOptimize = require("amd-optimize"),//amd规范压缩
    minifycss = require('gulp-minify-css'),//css压缩
    uglify = require('gulp-uglify'),//js压缩
    minifyHtml = require('gulp-minify-html'),//html压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    pngquant = require('imagemin-pngquant'),//深度压缩图片
    cache = require('gulp-cache'),//没有修改的图片直接从缓存文件读取（C:UsersAdministratorAppDataLocalTempgulp-cache）。
    notify = require('gulp-notify'),//提示信息
    assetRev = require('gulp-asset-rev'); //产生hash版本号

var sourcePathPrefix = 'assets';
var devResPath='dev/'+sourcePathPrefix;
var viewsPath = 'dev/views';
var destPath='release/'+sourcePathPrefix;
var releaseBootJS='release/assets/js/common.js';
var devBootJS='dev/config/boot.js';
var destViewPath='release/views';
var updateHtml=require('update-html');
var hashLen=32;

var updateInst=new updateHtml(path.join(__dirname,destViewPath),hashLen);

gulp.task('js', function () {
     gulp.src(devResPath + '/js/*.js')
        .pipe(gulp.dest(destPath+'/js'))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest(destPath+'/js'))
        .pipe(notify({message: 'js min ok!!!'}));
});

gulp.task('css', function () {
    return gulp.src(devResPath +'/css/*.css')
        .pipe(gulp.dest(destPath+'/css'))
        .pipe(minifycss())
        .pipe(assetRev({hashLen:hashLen}))
        .pipe(gulp.dest(destPath+'/css'))
        .pipe(notify({message: 'css min ok !!!'}));
});
gulp.task('common-css', function () {
  // 获取common中的公共css
      gulp.src([devResPath +'/css/common/*.css',devResPath +'/weight/*.css'])
        .pipe(concat('common.css'))
        .pipe(minifycss())
        .pipe(assetRev({hashLen:hashLen}))
        .pipe(gulp.dest(destPath+'/css/common/'))
        .pipe(notify({message: 'css common min ok !!!'}));
});

gulp.task('common-js', function () {
  // 获取common中的公共css
      gulp.src(['dev/libs/*.js'])
        .pipe(concat('common.js'))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest(destPath+'/js'))
        .pipe(notify({message: 'js common min ok !!!'}));
});

gulp.task('amd-js',function(){
  var fileNames=[];
  var sourceJS=devResPath + '/js/';
  var filesPaths=fs.readdirSync(sourceJS);
  filesPaths.forEach(function(filesPath){
    var fileName=sourceJS+filesPath;
    var stat = fs.lstatSync(fileName);
    var isDir=stat.isDirectory();
    if(!isDir){
      filesPath=filesPath.substring(0,filesPath.indexOf('.js'));
      var json={};
      json['srcPath']=fileName;
      json["main"]=filesPath;
      fileNames.push(json);
       
    }
  });
  

  fileNames.forEach(function(item){
    var rootPath=path.join(__dirname,'/dev/assets/js');
      gulp.src([item['srcPath']])
        .pipe(amdOptimize(item["main"],{
            baseUrl :rootPath,
            paths: {  
              "dialog":'../weight/dialog/dialog'
            },  
            findNestedDependencies: true,
            include: true
          }))

        .pipe(concat(item["main"]+".js"))
        .pipe(uglify({mangle:true}))
        .pipe(gulp.dest(destPath+'/js'))
        .pipe(notify({message: 'js weight amd min ok !!!'}));

  });
})
 

gulp.task('images', function () {
    return gulp.src(devResPath+'/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant({quality: '65-80'})]
        }))
        .pipe(gulp.dest(destPath+'/images/'))
        .pipe(notify({message: 'img min ok !!!'}));
});
gulp.task('html', function () {
      return gulp.src(viewsPath+'/*')
          .pipe(assetRev({hashLen:hashLen}))
          .pipe(gulp.dest(destViewPath+'/'))
          .pipe(notify({message: 'html ok !!!'}));
});


gulp.task('updateHtml',['html'],function(){
  updateInst.run(function(){
      //执行自身压缩
      gulp.run('minifyHtml');
  })
})

gulp.task('minifyHtml',function () {
  return gulp.src(destViewPath+'/*')
          .pipe(minifyHtml())
          .pipe(assetRev({hashLen:hashLen}))
          .pipe(gulp.dest(destViewPath+'/'))
          .pipe(notify({message: 'html min ok !!!'}));
});

gulp.task('font',function(){
  return gulp.src(devResPath+'/font/*')
        // .pipe(assetRev({hashLen:hashLen}))
        .pipe(gulp.dest(destPath+'/font/'))
        .pipe(notify({message: 'font  ok !!!'}));
});


//'weight','libs', 'amd-js',
gulp.task('all',['js', 'common-js','css','common-css','images','html','font','updateHtml','amd-js','watch']);

//监控
gulp.task('watch', function () {
    //监控js
    gulp.watch(devResPath + '/js/*.js',['js']);
    //监控weight
     gulp.watch(devResPath+'/weight/*/*.js',['amd-js']);
    //监控css
    gulp.watch([devResPath + '/css/**/*.css',devResPath+'/weight/*.css'], ['css','common-css','html','updateHtml']);
    //监控images
    gulp.watch(devResPath + '/images/*',['images']);
    // 监控字体
    gulp.watch(devResPath + '/font/*',['font']);
    //监控html
    gulp.watch(viewsPath + '/*.html',['html','updateHtml']);
})
gulp.task('default', ['all']);
