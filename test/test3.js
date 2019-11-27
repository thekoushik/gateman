var gateman=require('../index');
var validate;
function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            expect(validate(test[0])).toStrictEqual(test[1])
        })
    })
}

describe('requiredif',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"string|requiredif:email",
            email:"email",
            age:"number|required"
        });
    })
    doTests([
        [{age:2},null],
        [{name:"Koushik",age:2},null],
        [{email:"email@email.com",age:2},{name:{ requiredif: 'name is required beacause email is provided' }}]
    ])
})
describe('requiredif custom message',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"string|requiredif:email",
            email:"email",
            age:"number|required"
        },{
            name:{
                requiredif:"Please provide name with email"
            }
        });
    })
    doTests([
        [{email:"email@email.com",age:2},{name:{ requiredif: 'Please provide name with email' }}]
    ])
})
