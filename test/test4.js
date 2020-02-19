var gateman=require('../index');
var validate;
function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            expect(validate(test[0])).toStrictEqual(test[1])
        })
    })
}

describe('setGlobal',()=>{
    beforeAll(()=>{
        gateman.setGlobal({
            name: (value)=>(!value || (value.match(/^[a-zA-Z]{2,}$/)!=null)?null:'Please provide a valid name')
        });
        validate=gateman({
            name:"name",
            age:"number|required"
        });
    })
    doTests([
        [{age:2},null],
        [{name:"Koushik",age:2},null],
        [{name:"a",age:2},{"name": {"name": "Please provide a valid name"}}]
    ])
});
describe('use setGlobal from previous test case',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"required|name"
        });
    })
    doTests([
        [{name:""},{"name": {"required": "name is required"}}],
        [{name:"a"},{"name": {"name": "Please provide a valid name"}}],
        [{name:"ab"},null]
    ])
});