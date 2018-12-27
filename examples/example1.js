var Gateman=require('../index');
var validation=new Gateman({
    name:"string|required|minlength:5",
    age:"number|required",
    dob:"date",
    address:{
        country:"string",
        city:"string|required",
    }
});
var err=validation.validate({
    name:"Koushik",
    age:28,
    dob:"1990-04-01",
    address:{
        country:"India",
        city:"Kolkata",
    }
});
if(!err) console.log("Valid");
else console.log(err);