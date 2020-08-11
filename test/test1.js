var gateman=require('../index');
var validate;

function doTests(tests){
    tests.forEach((test)=>{
        it(JSON.stringify(test[0])+' => '+JSON.stringify(test[1]),()=>{
            expect(validate(test[0])).toStrictEqual(test[1])
        })
    })
}


describe('name:"string"',()=>{
    beforeAll(()=>{
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
    beforeAll(()=>{
        validate=gateman({
            name:"string|required"
        });
    })
    doTests([
        [{},{ name: { required: 'name is required' } }],
        [{name:"hello"},null]
    ])
})
describe('name:"string|minlength:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"string|minlength:2"
        });
    })
    doTests([
        [{},null],
        [{name:""},{name:{minlength:'name must be of atleast 2 characters'}}],
        [{name:"a"},{name:{minlength:'name must be of atleast 2 characters'}}],
        [{name:"foobar"},null],
    ])
})
describe('name:"string|maxlength:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"string|maxlength:2"
        });
    })
    doTests([
        [{},null],
        [{name:"foo"},{name:{maxlength:'name must be of atmost 2 characters'}}],
        [{name:"ab"},null],
    ])
})
describe('email:"email"',()=>{
    beforeAll(()=>{
        validate=gateman({
            email:"email"
        });
    })
    doTests([
        [{},null],
        [{email:2},{email:{email:'email must be an email'}}],
        [{email:"hello"},{email:{email:'email must be an email'}}],
        [{email:"hello@"},{email:{email:'email must be an email'}}],
        [{email:"hello@hello"},{email:{email:'email must be an email'}}],
        [{email:"hello@hello.he"},null],
    ])
})
describe('val:"min:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            val:"min:2"
        });
    })
    doTests([
        [{},null],
        [{val:"awd"},{val:{min:'val must be atleast 2'}}],
        [{val:1},{val:{min:'val must be atleast 2'}}],
        [{val:2},null],
        [{val:3},null],
    ])
})
describe('val:"max:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            val:"max:2"
        });
    })
    doTests([
        [{},null],
        [{val:"awd"},{val:{max:'val must be atmost 2'}}],
        [{val:1},null],
        [{val:2},null],
        [{val:3},{val:{max:'val must be atmost 2'}}],
    ])
})
describe('val:"digit:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            val:"digit:2"
        });
    })
    doTests([
        [{},null],
        [{val:0},{val:{digit:'val must have 2 digits'}}],
        [{val:100},{val:{digit:'val must have 2 digits'}}],
        [{val:10},null],
    ])
})
describe('val:"mindigit:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            val:"mindigit:2"
        });
    })
    doTests([
        [{},null],
        [{val:0},{val:{mindigit:'val must have atleast 2 digits'}}],
        [{val:10},null],
        [{val:100},null],
    ])
})
describe('val:"maxdigit:2"',()=>{
    beforeAll(()=>{
        validate=gateman({
            val:"maxdigit:2"
        });
    })
    doTests([
        [{},null],
        [{val:0},null],
        [{val:10},null],
        [{val:100},{val:{maxdigit:'val must have atmost 2 digits'}}],
    ])
})
describe('name:"uppercase"',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"uppercase"
        });
    })
    doTests([
        [{},null],
        [{name:"hello"},{name:{uppercase:'name must have all uppercase characters'}}],
        [{name:"HELLO"},null],
    ])
})
describe('name:"lowercase"',()=>{
    beforeAll(()=>{
        validate=gateman({
            name:"lowercase"
        });
    })
    doTests([
        [{},null],
        [{name:"HELLO"},{name:{lowercase:'name must have all lowercase characters'}}],
        [{name:"hello"},null],
    ])
})
describe('password:"required",confirm_password:"same:password"',()=>{
    beforeAll(()=>{
        validate=gateman({
            password:"required",confirm_password:"same:password"
        });
    })
    doTests([
        [{password:"a"},{confirm_password:{same:'confirm_password must be same as password'}}],
        [{password:"a",confirm_password:"aa"},{confirm_password:{same:'confirm_password must be same as password'}}],
        [{password:"a",confirm_password:"a"},null],
    ])
})
describe('terms:"accepted"',()=>{
    beforeAll(()=>{
        validate=gateman({
            terms:"accepted"
        });
    })
    doTests([
        [{},{terms:{accepted:'terms must be accepted'}}],
        [{terms:false},{terms:{accepted:'terms must be accepted'}}],
        [{terms:1},null],
        [{terms:"true"},null],
    ])
})
describe('age:"range:12:17"',()=>{
    beforeAll(()=>{
        validate=gateman({
            age:"number | range : 12:17"
        });
    })
    doTests([
        [{},null],
        [{age:11},{age:{range:'age must be between 12 and 17'}}],
        [{age:15},null],
    ])
})
