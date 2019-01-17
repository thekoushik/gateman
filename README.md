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
    tags:["string|maxcount:2"]
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
|min|Minimum value check|number|``` { price: "min:100" } ```|
|max|Maximum value check|number|``` { price: "max:1000" } ```|
|minlength|Minimum length check|number|``` { password: "minlength:5" } ```|
|maxlength|Maximum length check|number|``` { description: "maxlength:200" } ```|
|count|Array length check|number|``` { tags: ["count:2"]} ```|
|mincount|Minimum array length check|number|``` { tags: ["mincount:2"] } ```|
|maxcount|Maximum array length check|number|``` { tags: ["maxcount:2"] } ```|
|digit|Number of digit check|number|``` { pincode: ["digit:6"] } ```|
|mindigit|Minimum number of digit check|number|``` { amount: ["mindigit:3"] } ```|
|maxdigit|Maximum number of digit check|number|``` { amount: ["maxdigit:6"] } ```|
|uppercase|All characters are uppercase or not| |``` { name: "uppercase" } ```|
|lowercase|All characters are lowercase or not| |``` { name: "lowercase" } ```|
|same|Value to be same as other field|string|``` { password: "minlength:5", confirm_password: "same:password" } ```|
|accepted|Value to be truthy(eg. ```true``` or ```1``` )| |``` { terms: "accepted" } ```|

# WIP