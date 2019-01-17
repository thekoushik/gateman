var gateman=require('../index');
var GatemanError=require('../index').GatemanError;
var validate=gateman({
    name:"required|uppercase",
    products:[{
        "$required":true,
        name:"required",
        code:"number|digit:4",
        sub:[{
            code:"number|required|odd"
        }]
    }]
},{
    name:{
        required:"Customer Name is needed"
    },
    products:{
        required:"provide a product",
        name:"Product Name is needed",
    }
},{
    odd:(value)=>{
        return value%2==0?"%name% must be odd":null;
    }
});
var err=validate({
    name:"awdawdaw",
    products:[
        {
            code:12345678,
            sub:[
                {
                    code:111
                }
            ]
        },{
            name:"awd",
            code:12345,
            sub:[
                {
                    code:2
                }
            ]
        }
    ]
});
if(!err) console.log("Valid");
else console.log(JSON.stringify(err,null,2));