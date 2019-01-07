var assert=require('assert');
var gateman=require('../index');
var validate;

function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            assert.deepEqual( validate(test[0]),test[1])
        })
    })
}

describe('name:"string"',()=>{
    before(()=>{
        validate=gateman({
            name:"string"
        });
    })
    doTests([
        [{name:"hello"},null],
        [{name:"123"},null],
        [{name:123},{ name: { string: 'name must be a string' } }],
        [{},null]
    ])
})
describe('name:"string|required"',()=>{
    before(()=>{
        validate=gateman({
            name:"string|required"
        });
    })
    doTests([
        [{},{ name: { required: 'name is required' } }],
        [{name:"hello"},null]
    ])
})