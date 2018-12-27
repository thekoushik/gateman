# Gateman
Simple and easiest JSON validator

# Installation
```
npm install gateman
```

# Usage
```
var Gateman=require('gateman');
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
```

# Rules

1. string
2. number
3. date
4. email
5. required
6. min:<value>
7. max:<value>
8. minlength:<value>
9. maxlength:<value>

# WIP