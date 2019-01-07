var GatemanError = require('./gatemanerror');
module.exports={
    string:(a)=>{
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be a string";
        var errors=[];
        for(var i=0;i<a.length;i++)
            if(typeof a[i]!="string")
                errors.push(new GatemanError("Item "+i+" of %name% must be a string",i));
        return errors.length?errors:null;
    },
    number:(a)=>{
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be a number"
        var errors=[];
        for(var i=0;i<a.length;i++)
            if(typeof a[i]!="number")
                errors.push(new GatemanError("Item "+i+" of %name% must be a number",i));
        return errors.length?errors:null;
    },
    email:(a)=>{
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be an email";
        var errors=[];
        for(var i=0;i<a.length;i++){
            if(typeof a[i]!="string")
                errors.push(new GatemanError("Item "+i+" of %name% must be an email",i));
            else if(a.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)==null)
                errors.push(new GatemanError("Item "+i+" of %name% must be an email",i));
        }
        return errors.length?errors:null;
    },
    /*year:(a)=>{
        if(typeof a=="string")
    },*/
    required:(a)=>{
        if(Array.isArray(a))
            return a.length>0?null:"Atleast one %name% is required";
        else
            return a!=undefined?null:"Atleast one %name% is required";
    },
    count:(a,params)=>{
        const error_message="%name% must have exactly "+params[0]+" item(s)";
        if(!a) return null;
        if(!Array.isArray(a)) return error_message;
        if(params.length==0){
            throw new Error("Syntax Error: Rule count must have a parameter")
        }else if(typeof params[0]=="string" && ((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'")))){
            var path=params[0].substr(1,params[0].length-2);
            return error_message;
        }else
            return a.length!=Number(params[0])?error_message:null;
    },
    mincount:(a,params)=>{
        const error_message="%name% must have atleast "+params[0]+" item(s)";
        if(!a) return error_message;
        if(!Array.isArray(a)) return error_message;
        if(params.length==0){
            throw new Error("Syntax Error: Rule maxcount must have a parameter")
        }else if(typeof params[0]=="string" && ((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'")))){
            var path=params[0].substr(1,params[0].length-2);
            return error_message;
        }else
            return a.length<Number(params[0])?error_message:null;
    },
    maxcount:(a,params)=>{
        const error_message="%name% must have atmost "+params[0]+" item(s)";
        if(!a) return error_message;
        if(!Array.isArray(a)) return error_message;
        if(params.length==0){
            throw new Error("Syntax Error: Rule maxcount must have a parameter")
        }else if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return error_message;
        }else
            return a.length>Number(params[0])?error_message:null;
    },
    min:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule min must have a parameter")
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be atleast "+params[0];
        if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "All items of %name% must be atleast "+path;
        }else{
            params=params[0]
            var errors=[];
            for(var i=0;i<a.length;i++){
                if(typeof a[i]!="number")
                    errors.push(new GatemanError("Item "+i+" of %name% must be atleast "+params,i));
                else if(a[i]<Number(params))
                    errors.push(new GatemanError("Item "+i+" of %name% must be atleast "+params,i))
            }
            return errors.length?errors:null;
        }
    },
    max:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule max must have a parameter")
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be atmost "+params[0];
        if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "All items of %name% must be atmost "+path;
        }else{
            params=params[0]
            var errors=[];
            for(var i=0;i<a.length;i++){
                if(typeof a[i]!="number")
                    errors.push(new GatemanError("Item "+i+" of %name% must be atmost "+params,i));
                else if(a[i]>Number(params))
                    errors.push(new GatemanError("Item "+i+" of %name% must be atmost "+params,i))
            }
            return errors.length?errors:null;
        }
    },
    minlength:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule minlength must have a parameter")
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be of atleast "+params[0]+" character(s)";
        if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "All items of %name% must be of atleast "+path+" character(s)";
        }else{
            params=params[0]
            var errors=[];
            for(var i=0;i<a.length;i++){
                if(typeof a[i]!="string")
                    errors.push(new GatemanError("Item "+i+" of %name% must be of atleast "+params+" character(s)",i));
                else if(a[i].length<Number(params))
                    errors.push(new GatemanError("Item "+i+" of %name% must be of atleast "+params+" character(s)",i));
            }
            return errors.length?errors:null;
        }
    },
    maxlength:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule maxlength must have a parameter")
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be of atmost "+params[0]+" character(s)";
        if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "All items of %name% must be of atleast "+path+" character(s)";
        }else{
            params=params[0]
            var errors=[];
            for(var i=0;i<a.length;i++){
                if(typeof a[i]!="string")
                    errors.push(new GatemanError("Item "+i+" of %name% must be of atmost "+params+" character(s)",i));
                else if(a[i].length>Number(params))
                    errors.push(new GatemanError("Item "+i+" of %name% must be of atmost "+params+" character(s)",i));
            }
            return errors.length?errors:null;
        }
    },
    date:(a,params)=>{
        if(!a) return null;
        if(!Array.isArray(a)) return "All items of %name% must be a date";
        var format=null;
        if(params.length>0){
            if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'")))
                format=params[0].substr(1,params[0].length-2);
            else
                throw new Error("Date rule format must be string");
        }
        var errors=[];
        for(var i=0;i<a.length;i++){
            if(typeof a[i]!="string"){
                if(a[i] instanceof Date) continue;
                errors.push(new GatemanError("Item "+i+" of %name% must be a date",i));
            }else{
                if(format)
                    errors.push(new GatemanError("Item "+i+" of %name% must be a date",i));////////check format
                else if(isNaN(Date.parse(a[i])))
                    errors.push(new GatemanError("Item "+i+" of %name% must be a date",i));
            }
        }
        return errors.length?errors:null;
    }
}