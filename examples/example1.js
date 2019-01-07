var gateman=require('../index');
var validate=gateman({
    name:"string|required|minlength:5",
    age:"number|required",
    dob:"date",
    address:{
        country:"string",
        city:"string|required",
    },
    tags:["string|required"],
    favourites:[
        {
            "$mincount":2,
            type:{
                name:"string",
                ver:"required"
            },
            rating:"number|required"
        }
    ]
},{
    name:{
        string:"Please provide a valid name",
        required:"Please provide a name",
        minlength:"Name is too short"
    },
    address:"Please provide a valid address",
});
var err=validate({
    name:"Koushik",
    age:28,
    dob:"1990-04-01",
    address:{
        country:"India",
        city:"Kolkata"
    },
    tags:[3,"javascript",22],
});
if(!err) console.log("Valid");
else console.log(JSON.stringify(err,null,2));