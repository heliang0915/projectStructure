/**
 * require.js配置
 */
var isDev=true;
var prefixPath=isDev==true?"dev":"release";
var host ="localhost:8020";
// alert(host);
//资源目录
var resourcePath=host+"/"+prefixPath;
// 组件目录
var weightPath="/"+prefixPath+"/assets/weight";
require.config({
    "baseUrl" : 'http://'+resourcePath+'/assets/js',
    "paths" : {
        "dialog": weightPath+'/dialog/dialog',
    }
});


