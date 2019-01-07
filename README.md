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
    tags:["javascript","json"]
});
if(!err) console.log("Valid");
else console.log(err);
```

# Rules

|Rule|Description|Param|
|-|-|-|
|string|String type check| |
|number|Number type check| |
|date|Date or not| |
|email|Email or not| |
|required|Value given or not| |
|min|Minimum value check|number|
|max|Maximum value check|number|
|minlength|Minimum length check|number|
|maxlength|Maximum length check|number|
|count|Array length check|number|
|mincount|Minimum array length check|number|
|maxcount|Maximum array length check|number|

# WIP