'use strict';
var rules=require('./lib/rules');
var array_rules=require('./lib/array');
var GatemanError=require('./lib/gatemanerror');
/*
Have something unexpected? Stay out!
*/
function Gateman(schema,messages,custom){
    function register_error(key,error,errors,rule,message){
        var rulemessage;
        if(message){
            if(typeof message=="object")
                rulemessage=message[rule];
            else if(typeof message=="string")
                return errors[key]=message;
            else
                throw new Error("Syntax error: Message must be a string/object(see documentation)");
        }
        if(!errors[key]) errors[key]={};
        if(error instanceof GatemanError){
            if(error.index!=undefined){
                if(!errors[key][error.index]) errors[key][error.index]={};
                errors[key][error.index][rule]=rulemessage || error.message.replace(/%\w+%/g,target=>target=="%name%"?key:target);
            }else
                errors[key][rule]=rulemessage || error.message.replace(/%\w+%/g,target=>target=="%name%"?key:target);
        }else
            errors[key][rule]=rulemessage || error.replace(/%\w+%/g,target=>target=="%name%"?key:target);
    }
    function _validate(payload,schema,messages){
        var errors={};
        var breakOnFirstError=(typeof messages=="string");
        for(var key in schema){
            if(key[0]=="$"){
                if(key[1]!="$") continue;/////////////////////need review here in future
                key=key.substr(1);
            }
            var message=messages?((typeof messages=="object")?messages[key]:messages):undefined;
            if(Array.isArray(schema[key])){
                var breakOnFirstErrorArray=(typeof message=="string");
                if(payload[key] && !Array.isArray(payload[key])){
                    if(breakOnFirstError) return message;
                    else if(breakOnFirstErrorArray) errors[key]=message;
                    else errors[key]="Field "+key+" must be an array";
                    continue;
                }
                if(schema[key].length>1) console.log("Multiple schema is not supported yet.");
                var rule=schema[key][0];
                if(typeof rule=="string"){
                    for(var rule_array=rule.split('|'),i=0;i<rule_array.length;i++){
                        var r=rule_array[i],params=[];
                        if(r.includes(":"))
                            [r,...params]=r.split(":",2);
                        var msg;
                        if(custom && custom[r] && typeof custom[r]=="function")
                            msg=custom[r](payload && payload[key],params);
                        else if(array_rules[r])
                            msg=array_rules[r](payload && payload[key],params);
                        else
                            throw new Error("Rule "+r+" is not defined");
                        if(!msg) continue;
                        if(breakOnFirstError) return messages;
                        if(breakOnFirstErrorArray){
                            errors[key]=message;
                            break;
                        }
                        if(Array.isArray(msg))
                            for(var j=0;j<msg.length;j++)
                                register_error(key,msg[j],errors,r,message);
                        else
                            register_error(key,msg,errors,r,message);
                    }
                }else{//complex
                    var key_rules=Object.keys(rule).filter(i=>i[0]=="$" && i[1]!="$");
                    if(key_rules.length){//special case
                        for(var k=0;k<key_rules.length;k++){
                            var r=key_rules[k].substr(1);
                            var params=rule[key_rules[k]];
                            if(!Array.isArray(params)) params=[params];
                            var msg;
                            if(custom && custom[r] && typeof custom[r]=="function")
                                msg=custom[r](payload && payload[key],params);
                            else if(array_rules[r])
                                msg=array_rules[r](payload && payload[key],params);
                            else
                                throw new Error("Rule "+r+" is not defined");
                            if(!msg) continue;
                            if(breakOnFirstError) return messages;
                            if(breakOnFirstErrorArray){
                                errors[key]=message;
                                break;
                            }
                            if(Array.isArray(msg))
                                for(var j=0;j<msg.length;j++)
                                    register_error(key,msg[j],errors,r,message);
                            else
                                register_error(key,msg,errors,r,message);
                        }
                    }
                    var _payload=payload[key];
                    if(_payload!=undefined){
                        for(var k=0;k<_payload.length;k++){
                            var error=_validate(_payload[k],rule,message);
                            if(error){
                                if(breakOnFirstError) return messages;
                                if(breakOnFirstErrorArray){
                                    errors[key]=message;
                                    break;
                                }
                                if(!errors[key]) errors[key]={};
                                errors[key][k]=error;
                            }
                        }
                    }
                }
            }else if(typeof schema[key]=="object"){
                var error=_validate(payload && payload[key],schema[key],message);
                if(error){
                    if(breakOnFirstError) return messages;
                    errors[key]=error;
                }
            }else{
                for(var rule_array=schema[key].split('|'),i=0;i<rule_array.length;i++){
                    var rule=rule_array[i],params=[];
                    if(rule.includes(":"))
                        [rule,...params]=rule.split(":",2);
                    var msg;
                    if(custom && custom[rule] && typeof custom[rule]=="function")
                        msg=custom[rule](payload && payload[key],params,payload);
                    else if(rules[rule])
                        msg=rules[rule](payload && payload[key],params,payload);
                    else
                        throw new Error("Rule "+rule+" is not defined");
                    if(!msg) continue;
                    if(breakOnFirstError) return messages;
                    register_error(key,msg,errors,rule,message);
                }
            }
        }
        return Object.keys(errors)==0?null:errors;
    }
    return function(payload){
        return _validate(payload,schema,messages);
    }
}
module.exports=Gateman;
module.exports.GatemanError=GatemanError;