var gateman=require('../index');
var validate=gateman({
    name:"required",
    products:[{
        "$required":true,
        name:"required",
        code:"number|min:99999",
        sub:[{
            code:"number|required|min:99999"
        }]
    }]
},{
    name:{
        required:"Customer Name is needed"
    },
    products:{
        required:"provide a product",
        name:"Product Name is needed",
        code:{
            min:"min failed"
        }
    }
});
var err=validate({
    //name:"awdawdaw",
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
                    code:11177777
                }
            ]
        }
    ]
});
if(!err) console.log("Valid");
else console.log(JSON.stringify(err,null,2));