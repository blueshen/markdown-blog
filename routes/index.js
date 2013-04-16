
/*
 * GET home page.
 */
var fs = require('fs');

exports.index = function(req, res){
	var mdfiles = fs.readdirSync("./files/");
	console.log(mdfiles);
  	res.render('index', { title: 'MarkDown Blog', mdfiles : mdfiles });
};

 exports.content = function(req,res){
 	var mdFileName = req.params.name;
 	res.render("../files/"+mdFileName,{ title : mdFileName});
 };

 exports.upload = function(req,res){
 	res.render('upload',{ title : "上传Markdown文件"});
 };

 exports.uploadfile = function(req,res){
 	var filename = req.files.thumbnail.name;
 	var filetype = req.files.thumbnail.type;
 	console.log("filetype : "+filetype);
 	var tmp_path = req.files.thumbnail.path;
 	console.log(tmp_path);
 	var target_path = tmp_path;
 	if("text/x-markdown" == filetype){
 		target_path = "./files/"+filename;
 	}else if (filetype.indexOf("image/") >-1) {
 		target_path = "./public/images/blog/"+filename;
 	};
 
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         res.send('文件上传到: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
      });
    });
 };