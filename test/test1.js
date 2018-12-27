var assert=require('assert');
var Gateman=require('../index');
var validation;

describe("string test",()=>{
    before(()=>{
        validation=new Gateman({
            name:"string"
        });
    })
    it('"hello" should return null',()=>{
        assert.equal( validation.validate({name:"hello"}),null)
    })
    it('"123" should return null',()=>{
        assert.equal( validation.validate({name:"123"}),null)
    })
    it('123 should not return null',()=>{
        assert.notEqual(validation.validate({name:123}),null)
    })
    it('undefined should return null',()=>{
        assert.equal(validation.validate({}),null)
    })
})
describe("required test",()=>{
    before(()=>{
        validation=new Gateman({
            name:"string|required"
        });
    })
    it('undefined should not return null',()=>{
        assert.notEqual(validation.validate({}),null)
    })
    it('"hello" should return null',()=>{
        assert.equal( validation.validate({name:"hello"}),null)
    })
})