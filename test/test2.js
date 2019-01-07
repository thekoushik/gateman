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

describe('names:["string|required"]',()=>{
    before(()=>{
        validate=gateman({
            names:["string|required"]
        });
    })
    doTests([
        [{names:["hello"]},null],
        [{names:"hello"},{names:"Field names must be an array"}],
        [{names:[12]},{names:{"0":{string:"Item 0 of names must be a string"}}}],
        [{names:[]},{names:{"required": "Atleast one names is required"}}],
        [{names:[{a:9}]},{ names: { '0': { string: 'Item 0 of names must be a string' } } }]
    ])
})