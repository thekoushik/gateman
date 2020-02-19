var gateman=require('../index');
var validate;
function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            expect(validate(test[0])).toStrictEqual(test[1])
        })
    })
}

describe('regex rule',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"name",
            age:"number|required"
        },null,{
            name: /^[a-zA-Z]{2,}$/
        });
    })
    doTests([
        [{age:2},null],
        [{name:"", age:2},{"name": {"name": "Please enter valid name"}}],
        [{name:"a",age:2},{"name": {"name": "Please enter valid name"}}]
    ])
});