var gateman=require('../index');
var validate;
function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            expect(validate(test[0])).toStrictEqual(test[1])
        })
    })
}

describe('custom function return value can be truthy for error',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"hero"
        },null,{
			hero: v=>(v!='hero')
		});
    })
    doTests([
        [{name:["hello"]},{name: {hero: "name is invalid"}}],
		[{name:["hero"]},null]
    ])
})