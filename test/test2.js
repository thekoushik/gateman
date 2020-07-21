var gateman=require('../index');
var validate;
function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            expect(validate(test[0])).toStrictEqual(test[1])
        })
    })
}

describe('names:["string|required"]',()=>{
    beforeAll(()=>{
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
describe('tags:["mincount:2"]',()=>{
    beforeAll(()=>{
        validate=gateman({
            tags:["string|mincount:2"]
        });
    })
    doTests([
        [{},{tags:{mincount:'tags must have atleast 2 item(s)'}}],
        [{tags:[]},{tags:{mincount:'tags must have atleast 2 item(s)'}}],
        [{tags:["hello"]},{tags:{mincount:'tags must have atleast 2 item(s)'}}],
        [{tags:["hello","world"]},null],
        [{tags:["hello","world","foobar"]},null],
    ])
})
describe('tags:["maxcount:2"]',()=>{
    beforeAll(()=>{
        validate=gateman({
            tags:["string|maxcount:2"]
        });
    })
    doTests([
        [{},{tags:{maxcount:'tags must have atmost 2 item(s)'}}],
        [{tags:[]},null],
        [{tags:["hello"]},null],
        [{tags:["hello","world"]},null],
        [{tags:["hello","world","foobar"]},{tags:{maxcount:'tags must have atmost 2 item(s)'}}],
    ])
})
describe('tags:["count:2"]',()=>{
    beforeAll(()=>{
        validate=gateman({
            tags:["string|count:2"]
        });
    })
    doTests([
        [{},{tags:{count:'tags must have exactly 2 item(s)'}}],
        [{tags:[]},{tags:{count:'tags must have exactly 2 item(s)'}}],
        [{tags:["hello"]},{tags:{count:'tags must have exactly 2 item(s)'}}],
        [{tags:["hello","world"]},null],
        [{tags:["hello","world","foobar"]},{tags:{count:'tags must have exactly 2 item(s)'}}],
    ])
})
describe('custom validation in array 1',()=>{
    beforeAll(()=>{
        validate=gateman({
            times:["string|time"]
        },null,{
            time: /^([0-9]){2}:([0-9]){2}:([0-9]){2}$/
        });
    })
    doTests([
        [{times:["10:10:10"]},null],
    ])
})
describe('tags:[{"$count":2,name: "string|required",type: "number"}]',()=>{
    beforeAll(()=>{
        validate=gateman({
            tags:[{
                '$count': 2,
                name: "string|required",
                type: 'number'
            }]
        });
    })
    doTests([
        [{},{tags:{count:'tags must have exactly 2 item(s)'}}],
        [{tags:[]},{tags:{count:'tags must have exactly 2 item(s)'}}],
        [{tags:[{name:'awd'},{name: 'aa'}]},null]
    ]);
    it(JSON.stringify({tags:[{name:""}]})+' => '+JSON.stringify({'tags.0.name.required': 'name is required','tags.count':'tags must have exactly 2 item(s)'}),()=>{
        expect(validate({tags:[{name:""}]},{flatten:true})).toStrictEqual({'tags.0.name.required': 'name is required','tags.count':'tags must have exactly 2 item(s)'})
    })
})