const express = require("express");
const { ftruncateSync } = require("fs");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mynewdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
})();
//schema
const sch={
    name:String,
    email:String,
    id:Number
}
const monmodel=mongoose.model("Newcol",sch);

//Post req

app.post("/post",async(req,res)=>{
    console.log("inside my post function");

    const data=new monmodel({
        name:req.body.name,
        email:req.body.email,
        id:req.body.id
    });
    const val=await data.save();
    res.json(val);
})

// put
app.put("/update/:id",async(req,res)=>{
    let upid=req.params.id;
    let upname=req.body.name;
    let upemail=req.body.email;

    // finding id to update
    // uodate it
      monmodel.findOneAndUpdate({id:upid},{$set:{name:upname,email:upemail}},{new:true},(err,data)=>{
        if(data==null){
            req.send("nothing to change");
        }
        else{
            res.send(data);
        }
      })  

})

// fetch get with id
app.get('/fetch/:id',function(req,res){
    fetchid=req.params.id;
    monmodel.find(({id:fetchid}), function(err,val){
        if(err){
            res.send("erroe 406");
        }else{
           
        if(val.length==0)
{
    res.send("data is not presnet");
}  
else{
    res.send(val);
}
  }
})
})

//delete
app.delete('/del/:id',function(req,res){
    let delid=req.params.id;
    monmodel.findOneAndDelete(({id:delid}),function(err,data){
        if(err){
            res.send("erroe");
        }
        else{
       if(data==null){
        res.send("no response id is not");
       } 
       else{
        res.send(data);
       }
    }
    })
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
