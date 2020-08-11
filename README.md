# Gateman
Simple and easiest JSON validator

# Documentation
see [docs.md](docs.md)

# Installation
```
npm install gateman
```

# Basic Usage
```javascript
var gateman=require('gateman');
var validate=gateman({
    name:"string|minlength:5|required",
    age:"number|required",
    dob:"date",
    password:"required|minlength:4",
    confirm_password:"same:password",
    address:{
        country:"string",
        city:"string|required",
    },
    tags:["string|$maxcount:2"]
});
var err=validate({
    name:"Koushik",
    age:28,
    dob:"1990-04-01",
    address:{
        country:"India"
    },
    password:"abcd",
    confirm_password:"abcd",
    tags:["javascript","json"]
});
if(!err) console.log("Valid");
else console.log(err);
```

# Rules

|Rule|Description|Param Type|Example|
|-|-|-|-|
|string|String type check| |``` { name: "string" } ```|
|number|Number type check| |``` { age: "number" } ```|
|date|Date or not| |``` { dob: "date" } ```|
|email|Email or not| |``` { email: "email" } ```|
|required|Value given or not| |``` { address: "required" } ```|
|requiredif|Required if another field is given|string| ``` { city: "string", address: "string | requiredif: city" } ``` |
|min|Minimum value check|number|``` { price: "min:100" } ```|
|max|Maximum value check|number|``` { price: "max:1000" } ```|
|minlength|Minimum length check|number|``` { password: "minlength:5" } ```|
|maxlength|Maximum length check|number|``` { description: "maxlength:200" } ```|
|digit|Number of digit check|number|``` { pincode: ["digit:6"] } ```|
|mindigit|Minimum number of digit check|number|``` { amount: ["mindigit:3"] } ```|
|maxdigit|Maximum number of digit check|number|``` { amount: ["maxdigit:6"] } ```|
|uppercase|All characters are uppercase or not| |``` { name: "uppercase" } ```|
|lowercase|All characters are lowercase or not| |``` { name: "lowercase" } ```|
|same|Value to be same as other field|string|``` { password: "minlength:5", confirm_password: "same:password" } ```|
|accepted|Value to be truthy(eg. ```true``` or ```1``` )| |``` { terms: "accepted" } ```|
|range|Value between 2 numbers(inclusive)| |``` { price: "range : 100 : 200" } ```|

# Array Rules

Array rules operate on whole array and are prefixed with `$` symbol.

|Rule|Description|Param Type|Example|
|-|-|-|-|
|required|Atleast one array item is required| |``` { address: ["$required"] } ```|
|count|Array length check|number|``` { tags: ["$count:2"]} ```|
|mincount|Minimum array length check|number|``` { tags: ["$mincount:2"] } ```|
|maxcount|Maximum array length check|number|``` { tags: ["$maxcount:2"] } ```|

## Using array rules in keys

```javascript
{
	favourites:[
        {
            "$mincount": 2,
            "$maxcount": 10,
            rating:"number | required"
        }
    ]
}
```

a valid json with respect to the above schema would be

```javascript
{
	favourites:[
        {
            rating: 44
        },{
            rating: 22
        }
    ]
}
```

# Using with ***expressjs***
```javascript
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var gateman = require('gateman');
//the following higher order function creates expressjs middleware
var validate = (schema, customMessages, customValidators)=>{
	var validatorFn = gateman(schema, customMessages, customValidators);
	return (req,res,next)=>{
		req.errors = validatorFn(req.body,{flatten:true});
		next();
	}
}
//use the middleware
app.post('/demo', validate({
    email:"email|required",
    location:"string|required|minlength:10"
}), (req, res) => {
	if(req.errors){
		return res.status(422).json({
			success: false,
			error: req.errors
		});
	}
	res.json({
		success:true,
		data:req.body
	});
});

app.listen(8080, () => {
	console.log(name + ' is live at 8080');
});
```

# WIP
