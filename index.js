'use strict';
var key_rules=require('./lib/rules');
var array_rules=require('./lib/array');
var GatemanError=require('./lib/gatemanerror');
var globals={};

/**
 * Similar to compile() but with array rule support in keys
 * @param {*} schema Schema object
 * @param {*} custom Custom validations
 */
function compileArrayNested(schema,custom){
    //$ rules supported in keys
    let processed_schema={};
    let compiled_rules_array=[];
    for(let rule in schema){
        let schema_body=schema[rule];
        if(rule[0]=='$'){
            let array_rule_name=rule.substr(1);
            let params=[];
            if(Array.isArray(schema_body)){
                params=schema_body;
            }else{
                params=[schema_body];
            }
            if(custom[array_rule_name]){
                if(typeof custom[rule] =='function'){
                    compiled_rules_array.push({rule:array_rule_name, fn:(value,payload)=>custom[array_rule_name](value,params,payload) });
                    continue;
                }else{
                    throw new Error("Custom array rule must be function");
                }
            }else if(globals[array_rule_name]){
                if(typeof custom[rule] =='function'){
                    compiled_rules_array.push({rule:array_rule_name, fn:(value,payload)=>globals[array_rule_name](value,params,payload) });
                    continue;
                }else{
                    throw new Error("Global array rule must be function");
                }
            }else if(array_rules[array_rule_name]){
                compiled_rules_array.push({rule:array_rule_name, fn:(value,payload)=>array_rules[array_rule_name](value,params,payload) });
                continue;
            }else{
                processed_schema[rule]=schema_body;
            }
        }else{
            processed_schema[rule]=schema_body;
        }
    }
    return {
        rules: compile(processed_schema,custom),
        array_rules: compiled_rules_array
    }
}
/**
 * Simplifies rules to executable functions
 * @param {*} rules Rules separated by |
 * @param {*} custom Custom validation
 * @param {*} arraySupport Whether to compile array rules or not
 */
function getRules(rules,custom,arraySupport){
    let compiled_rules=[];
    let compiled_rules_array=[];
    let rule_names=rules.split('|');
    for(let i=0;i<rule_names.length;i++){
        let {rule,params}=parseRule(rule_names[i]);
        if(arraySupport){
            if(rule[0]=='$'){
                let array_rule_name=rule.substr(1);
                if(custom[array_rule_name]){
                    if(typeof custom[rule] =='function'){
                        compiled_rules_array.push({rule:array_rule_name, fn:(value,payload)=>custom[array_rule_name](value,params,payload) });
                        continue;
                    }else{
                        throw new Error("Custom array rule must be function");
                    }
                }else if(globals[array_rule_name]){
                    if(typeof custom[rule] =='function'){
                        compiled_rules_array.push({rule:array_rule_name, fn:(value,payload)=>globals[array_rule_name](value,params,payload) });
                        continue;
                    }else{
                        throw new Error("Global array rule must be function");
                    }
                }else if(array_rules[array_rule_name]){
                    compiled_rules_array.push({rule:array_rule_name, fn:(value,payload)=>array_rules[array_rule_name](value,params,payload) });
                    continue;
                }//if not defined without $ then act as normal rule with $
            }
        }
        if(custom[rule]){
            if(custom[rule] instanceof RegExp){
                compiled_rules.push({rule,fn: (value)=>runRegEx(custom[rule],value)});
            }else{
                compiled_rules.push({rule,fn: (value,payload)=>custom[rule](value,params,payload)})
            }
        }else if(globals[rule]){
            if(globals[rule] instanceof RegExp){
                compiled_rules.push({rule,fn: (value)=>runRegEx(globals[rule],value)});
            }else{
                compiled_rules.push({rule,fn: (value,payload)=>globals[rule](value,params,payload)})
            }
        }else if(key_rules[rule]){
            compiled_rules.push({rule,fn: (value,payload)=>key_rules[rule](value,params,payload)});
        }else{
            throw new Error("Rule "+rule+" not defined");
        }
    }
    if(arraySupport) 
        return { rules: compiled_rules, array_rules: compiled_rules_array }
    else
        return {rules: compiled_rules}
}
/**
 * Simplifies nested objects
 * @param {*} schema Schema definition
 * @param {*} custom Custom validation
 */
function compile(schema,custom){
    let direct= [];
    let nested=[];
    let array_of_rules=[];
    for(let key in schema){
        let value=schema[key];
        if(typeof value=='string'){
            direct.push({ name: key, ...getRules(value, custom) });
        }else if(Array.isArray(value)){
            let array_schema=value[0];//multiple array elements not supported
            if(array_schema){
                if(typeof array_schema=='string'){
                    array_of_rules.push({name: key, ...getRules(array_schema,custom,true) });
                }else if(typeof value=='object' && value){
                    array_of_rules.push({name: key, nested: true, ...compileArrayNested(array_schema,custom) });
                }else{
                    throw new Error("Invalid type in array key "+key)
                }
            }else{
                throw new Error("Array should not be empty in key "+key)
            }
        }else if(typeof value=='object' && value){
            nested.push({ name: key, rules: compile(value,custom) })
        }else{
            throw new Error("Invalid type in key "+key)
        }
    }
    return { direct, nested, array_of_rules };
}
/**
 * Interpreter for compiled rules
 * @param {*} compiled_schema Compiled schema definition
 * @param {*} payload Payload object to test
 * @param {*} messages Custom messages
 * @param {*} custom Custom validation
 */
function runner(compiled_schema,payload,messages,custom){
    let { direct, nested, array_of_rules }=compiled_schema;
    let errors={};
    let breakOnFirstError=(typeof messages=="string");
    for(let i=0;i<direct.length;i++){
        let {name,rules}=direct[i];
        let message=typeof messages=='object'?messages[name]:messages;
        let payload_value=payload[name];
        for(let r=0;r<rules.length;r++){
            let {rule,fn}=rules[r];
            let msg=fn(payload_value,payload);
            if(msg){
                if(breakOnFirstError) return messages;
                registerError(name,msg,errors,rule,message);
            }
        }
    }
    for(let i=0;i<nested.length;i++){
        let {name,rules}=nested[i];
        let message=messages[name];
        let msg=runner(rules,payload[name],message,custom);
        if(msg){
            if(breakOnFirstError) return messages;
            registerError(name,msg,errors,rule,message);
        }
    }
    for(let i=0;i<array_of_rules.length;i++){
        let {name,rules,array_rules,nested}=array_of_rules[i];
        let message=messages[name];
        let breakOnFirstErrorArray=(typeof message=="string");
        let payload_value=payload[name];
        for(let r=0;r<array_rules.length;r++){
            let {rule,fn}=array_rules[r];
            let msg=fn(payload_value,payload);
            if(msg){
                if(breakOnFirstError) return messages;
                if(breakOnFirstErrorArray){
                    errors[name]=message;
                    break;
                }
                if(Array.isArray(msg))
                    for(let j=0;j<msg.length;j++)
                        registerError(name,msg[j],errors,rule,message);
                else
                    registerError(name,msg,errors,rule,message);
            }
        }
        if(breakOnFirstErrorArray && errors[name]){
            break;
        }
        if(payload_value){
            if(Array.isArray(payload_value)){
                for(let j=0;j<payload_value.length;j++){
                    let payload_value_array_item=payload_value[j];
                    if(nested){
                        let msg=runner(rules,payload_value_array_item,message,custom);
                        if(msg){
                            if(breakOnFirstError) return messages;
                            if(breakOnFirstErrorArray){
                                errors[name]=message;
                                break;
                            }
                            if(!errors[name]) errors[name]={};
                            errors[name][j]=msg;
                        }
                    }else{
                        for(let r=0;r<rules.length;r++){
                            let {rule,fn}=rules[r];
                            let msg=fn(payload_value_array_item,payload);
                            if(msg){
                                if(breakOnFirstError) return messages;
                                if(breakOnFirstErrorArray){
                                    errors[name]=message;
                                    break;
                                }
                                registerError(name,new GatemanError(msg,j),errors,rule,message);
                            }
                        }
                    }
                    if(breakOnFirstErrorArray && errors[name]){
                        break;
                    }
                }
            }else{
                if(breakOnFirstError)
                    return message;
                else if(breakOnFirstErrorArray)
                    errors[name]=message;
                else
                    errors[name]="Field "+name+" must be an array";
                continue;
            }
        }
    }
    return Object.keys(errors).length?errors:null;
}
/**
 * Validator creator function
 * 
 * @param schema    Schema definition object
 * @param messages  Custom message definition object
 * @param custom    Custom validation definition object
 */
function Gateman(schema,messages,custom){
    let _messages=messages||{};
    let _customs=custom||{};
    for(let key in custom){
        let value=custom[key];
        if(!value) throw new Error("Invalid custom validation "+key+". Only Function and RegExp supported.");
        if(typeof value!='function' && !(value instanceof RegExp)){
            throw new Error("Invalid custom validation "+key+". Only Function and RegExp supported.");
        }
    }
    let compiled=compile(schema,_customs,globals);
    let opt={};
    return (payload,options)=>{
        opt={
            flatten:false,
            ignoreSingle:false,
            ...options
        };
        let errors=runner(compiled,payload,_messages,_customs);
        return (opt.flatten && errors)?flattenObj(errors):errors;
    }
}
/**
 * Adds error to the specified error object with parsed string
 * @param {*} key Payload key name
 * @param {*} error Error message or object
 * @param {*} errors Destination error object
 * @param {*} rule Rule name
 * @param {*} message Custom message
 */
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
/**
 * Converts a nested object to a flat object
 * @param {*} obj Object to convert
 */
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
/**
 * Parses a rule and its parameters
 * @param {*} str String
 */
function parseRule(str){
    if(!str.includes(":"))
        return {
            rule:str.trim(),
            params:[]
        };
    var [rule,...params]=str.split(":");
    return {
        rule: rule.trim(),
        params: params.map(m=>m.trim())
    };
}
/**
 * Executes a regex match
 * @param {*} regex RegExp pattern
 * @param {*} value Value to match
 */
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