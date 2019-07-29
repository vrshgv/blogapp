var express=require("express");
var app=express();
const mongoose=require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer= require("express-sanitizer");
app.use(methodOverride('_method'));
mongoose.connect("mongodb://localhost:27017/blog_app",{ useNewUrlParser: true }); 
app.set("view engine", "ejs");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressSanitizer());

app.listen("3000",function(){
    console.log("server is started");
});

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog=new mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "I have a dog!",
// 	image:"https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
// 	body:"Oh look at this wonderful creature!!",
	
// }, function(error, createdDog){
// 	console.log(createdDog);
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(error,blogs){
		if(error){
			console.log(error);
		}else{
			res.render("index",{blogs: blogs});
		}
	});
	
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});
app.post("/blogs", function(req,res){
	
	var data=req.body.blog;
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(data, function(error, createdBlog){
		if(error){
			console.log(error);
			res.render("new");
		}else{
			console.log(req.body);
			console.log(req.body.blog);
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog:foundBlog});
		}
	});
});
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog:foundBlog});
		}
	});
});

app.put("/blogs/:id", function(req,res){
		req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, upd){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndDelete(req.params.id,function(err){
		if(err){
			console.log(err);
		res.redirect("/blogs");
		}else{
		res.redirect("/blogs");
		}
	});
});