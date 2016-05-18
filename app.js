var express=require('express');
var path=require('path');
var ejs=require('ejs');
var app=express();

console.log('pathname'+__dirname);

// app.use(express.static(path.join(__dirname,'test')));
app.use(express.static(path.join(__dirname)));

app.engine('html',ejs.__express);
app.set('view engine', 'html');


app.get('/ajax',function (req,res) {
   res.send('index');
})
app.listen(8020);
