const express=require("express");
const app=express();
let port=3000;
var methodOverride = require('method-override');
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
require('dotenv').config();
var ObjectID = require('mongodb').ObjectID;
const dbUrl="mongodb+srv://srtanushrisoni22:naUyxc1G4kPwoEBr@cluster0.9xwduo7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0process.env.ATLASDB_URL";
var session = require('express-session');
const MongoStore = require('connect-mongo');
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    }
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOptions));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to db");

}).catch((err)=>{
    console.log(err);
})

app.listen(port,()=>{
    console.log("Working")
})













const schema=mongoose.Schema({topic:String,title:String,content:String});
const data=mongoose.model("data",schema);
app.get("/posts",async(req,res)=>{
    let posts= await data.find();
    res.render("index.ejs",{posts});
})
app.get("/posts/:id",async (req,res)=>{
    let {id}=req.params;
    let post= await data.findOne({_id:`${id}`});
    res.render("show.ejs",{post});
    
})
app.get("/post/new",(req,res)=>{
    res.render("write.ejs");
})
app.post("/posts",(req,res)=>{
    let {topic,title,content}=req.body;
    const p={topic,title,content};
    const newpost=new data(p);
    newpost.save();
    console.log(p);
    res.redirect("/posts");
})
app.get("/posts/delete/:id",async(req,res)=>{
    let {id}=req.params;
    await data.deleteOne({_id:`${id}`});
    res.redirect("/posts");

})
