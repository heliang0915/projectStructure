/**
 * require.js配置
 */
var isDev=true;
var prefixPath=isDev==true?"dev":"release";
var host = location.host;
//资源目录
var resourcePath=host+"/"+prefixPath;
// 组件目录
var weightPath="../../assets/weight";
require.config({
    "baseUrl" : 'http://'+resourcePath+'/asset/js',
    "paths" : {
        "text": '../libs/text',
        "dialog": weightPath+'/dialog/dialog',
    }
});
