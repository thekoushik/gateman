'use strict';
var rules=require('./lib/rules');
var array_rules=require('./lib/array');
var GatemanError=require('./lib/gatemanerror');
var globals={};

/**
 * Validator creator function
 * 
 * @param schema    Schema definition object
 * @param messages  Custom message definition object
 * @param custom    Custom validation definition object
 */
function Gateman(schema,messages,custom){
    function _validate(payload,schema,messages){
        var errors={};
        var breakOnFirstError=(typeof messages=="string");
        for(var key in schema){
            if(key[0]=="$"){
                var temp=key.substr(1);
                if(custom[temp]){ key=temp; continue;}
                else if(array_rules[temp]){ key=temp; continue;}
                else if(rules[temp]){ key=temp; continue;}///////////future revision required to allow rules to be as key in object
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
                if(schema[key].length>1) console.warn("Multiple schema is not supported yet.");
                var rule=schema[key][0];
                if(typeof rule=="string"){
                    for(var rule_array=rule.split('|'),i=0;i<rule_array.length;i++){
                        var {rule,params}=parseRule(rule_array[i]);
                        var msg=runArrayRule(custom,rule,key,params,payload);
                        if(!msg) continue;
                        if(breakOnFirstError) return messages;
                        if(breakOnFirstErrorArray){
                            errors[key]=message;
                            break;
                        }
                        if(Array.isArray(msg))
                            for(var j=0;j<msg.length;j++)
                                registerError(key,msg[j],errors,rule,message);
                        else
                            registerError(key,msg,errors,rule,message);
                    }
                }else{//complex
                    var key_rules=Object.keys(rule).filter(i=>i[0]=="$" && i[1]!="$");
                    if(key_rules.length){//special case
                        for(var k=0;k<key_rules.length;k++){
                            var r=key_rules[k].substr(1);
                            var params=rule[key_rules[k]];
                            if(!Array.isArray(params)) params=[params];
                            var msg=runArrayRule(custom,r,key,params,payload);
                            if(!msg) continue;
                            if(breakOnFirstError) return messages;
                            if(breakOnFirstErrorArray){
                                errors[key]=message;
                                break;
                            }
                            if(Array.isArray(msg))
                                for(var j=0;j<msg.length;j++)
                                    registerError(key,msg[j],errors,r,message);
                            else
                                registerError(key,msg,errors,r,message);
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
                    var {rule,params}=parseRule(rule_array[i]);
                    var msg;
                    if(custom && custom[rule]){
                        if(typeof custom[rule]=="function")
                            msg=custom[rule](payload && payload[key],params,payload);
                        else if(custom[rule] instanceof RegExp){
                            msg=runRegEx(custom[rule],payload && payload[key])
                        }
                    }else if(globals[rule]){
                        if(typeof globals[rule]=="function")
                            msg=globals[rule](payload && payload[key],params,payload);
                        else if(globals[rule] instanceof RegExp){
                            msg=runRegEx(globals[rule],payload && payload[key])
                        }
                    }else if(rules[rule])
                        msg=rules[rule](payload && payload[key],params,payload);
                    else
                        throw new Error("Rule "+rule+" is not defined");
                    if(!msg) continue;
                    if(breakOnFirstError) return messages;
                    registerError(key,msg,errors,rule,message);
                }
                if(opt.ignoreSingle && errors[key] && typeof errors[key]!="string"){
                    if(Object.keys(errors[key]).length==1){
                        var k=Object.keys(errors[key])[0];
                        errors[key]=errors[key][k];
                    }
                }
            }
        }
        return Object.keys(errors)==0?null:errors;
    }
    var opt={};
    return function(payload,options){
        opt={
            flatten:false,
            ignoreSingle:false,
            ...options
        };
        var errors=_validate(payload,schema,messages);
        return (opt.flatten && errors)?flattenObj(errors):errors;
    }
}
/**
 * Run the provided validation for every item in array
 * 
 * @param array Array to check
 * @param cb    Callback to execute with each item from array
 */
function runForEveryItem(array,cb){
    if(!array) return null;
    if(!Array.isArray(array)) return "%name% must be an array";
    var errors=[];
    for(var i=0;i<array.length;i++){
        var error=cb(array[i]);
        if(error) errors.push(new GatemanError(error,i));
    }
    return errors.length?errors:null;
}
/**
 * Run array rules for built-in, custom and global rules
 * 
 * @param custom    Custom validations
 * @param rule      rule name
 * @param key       Key name
 * @param params    Parameters for rule functions
 * @param payload   Payload data
 */
function runArrayRule(custom,rule,key,params,payload){
    if(custom && custom[rule]){
        if(typeof custom[rule]=="function")
            return runForEveryItem(payload && payload[key], (item)=>custom[rule](item,params)); //custom[rule](payload && payload[key],params);
        else if(custom[rule] instanceof RegExp)
            return runForEveryItem(payload && payload[key], (item)=>runRegEx(custom[rule],item)); //runRegEx(custom[rule],payload && payload[key]);
    }else if(globals[rule]){
        if(typeof globals[rule]=="function")
            return runForEveryItem(payload && payload[key], (item)=>globals[rule](item,params)); //globals[rule](payload && payload[key],params);
        else if(globals[rule] instanceof RegExp)
            return runForEveryItem(payload && payload[key], (item)=>runRegEx(globals[rule],item)); //runRegEx(globals[rule],payload && payload[key]);
    }else if(array_rules[rule])
        return array_rules[rule](payload && payload[key],params);
    else
        throw new Error("Rule "+rule+" is not defined");
    return null;
}
function registerError(key,error,errors,rule,message){
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
    }else if(typeof error=='string')
        errors[key][rule]=rulemessage || error.replace(/%\w+%/g,target=>target=="%name%"?key:target);
	else//truthy value
		errors[key][rule]=rulemessage || (key+' is invalid');
}
function parseRule(str){
    if(!str.includes(":"))
        return {rule:str.trim(),params:[]};
    var [rule,...params]=str.split(":",2);
    return {rule:rule.trim(),params:params.map(m=>m.trim())};
}
function flattenObj(obj){
    var f_obj={};
    for(var key in obj){
        var item=obj[key]
        if(typeof item=="string")
            f_obj[key]=item
        else{
            var result=flattenObj(item)
            for(var k in result)
                f_obj[key+"."+k]=result[k]
        }
    }
    return f_obj;
}
function runRegEx(regex,value){
    if(value==undefined && value==null) return null;
    if(typeof value!="string") return "Please enter valid %name%";
    return value.match(regex)!=null?null:"Please enter valid %name%";
}
module.exports=Gateman;
module.exports.setGlobal=function(obj){
    globals={...globals,...obj};
}
module.exports.GatemanError=GatemanError;