const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
app.use(cookieparser());

app.get("/root/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.send("sent you some cookies");
})

app.get("/root",(req,res)=>{
    console.dir(req.cookies);
    res.send("hi i am root user");
});

app.listen(8080,()=>{
    console.log("server is listening on localhost 8080");
});