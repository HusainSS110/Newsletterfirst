const express= require("express");
const bodyparser= require("body-parser");
const request = require("request");
const app = express();
const https= require("https");
const { url } = require("inspector");
const { log } = require("console");

app.use(express.static("public"));  // to use sites which are we using to syle our page in html file
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {
    const fn = req.body.fname;
    const ln = req.body.lname;
    const em = req.body.emailadd;
    const data = {
        members:[
            {
            email_address: em,
            status: "subscribed",
            merge_fields:{
                FNAME: fn,
                LNAME:ln
            }
        }
    ]
    };
    const jsondata=JSON.stringify(data);

    const url ="https://us21.api.mailchimp.com/3.0/lists/3fa27e5069";

    const options ={
        method: "POST",
        auth: "sahil:6e13d09ef94808393047a52606a010e7-us21"
    }

    const request = https.request(url, options, function(response) {
        
        if(response.statusCode=== 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })


    });
    request.write(jsondata);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");       //this for redirect to homepage after post request from failure page(try again button)
})

app.listen(process.env.PORT || 3000,function() {  //PROCESS.ENV WILL SET UP DYNAMIC PORT FOR YOU BY HEROKU
    console.log("Server is running");
})

//api key
//6e13d09ef94808393047a52606a010e7-us21
//list id
//3fa27e5069