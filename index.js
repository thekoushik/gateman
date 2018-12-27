var rules=require('./lib/rules');
/*
Have something unexpected? Stay out!
*/
class Gateman{
    constructor(schema){
        this.schema=schema;
    }
    validate(payload){
        var totalPayload=arguments[1] || payload;
        var schema=arguments[2] || this.schema;
        var errors={};
        for(var key in schema){
            if(Array.isArray(schema[key])){
                //
            }else if(typeof schema[key]=="object"){
                var error=this.validate(payload[key],totalPayload,schema[key]);
                if(error) errors[key]=error;
            }else
                schema[key].split('|').forEach((m)=>{
                    var rule=m,params=[];
                    if(m.includes(":"))
                        [rule,...params]=m.split(":");
                    var msg=rules[rule](payload[key],params);
                    if(!msg) return;
                    if(!errors[key]) errors[key]={};
                    errors[key][rule]=msg.replace(/%\w+%/g,(target)=>{
                        return target=="%name%"?key:target;
                    });
                })
        }
        return Object.keys(errors)==0?null:errors;
    }
}
module.exports=Gateman;