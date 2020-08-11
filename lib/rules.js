module.exports={
    string:(val)=>{
        if(!val) return null;
        return typeof val=="string"?null:("%name% must be a string")
    },
    number:(val)=>{
        if(!val) return null;
        return typeof val=="number"?null:("%name% must be a number")
    },
    email:(val)=>{
        if(val==undefined && val==null) return null;
        if(typeof val!="string") return "%name% must be an email";
        return val.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)!=null?null:"%name% must be an email";
    },
    /*year:(val)=>{
        if(typeof val=="string")
    }*/
    required:(val)=>{
        if(typeof val=="string")
            return val.length==0?"%name% is required":null
        else
            return (val!=undefined && val!=null)?null:"%name% is required"
    },
    requiredif:(val,params,payload)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule requiredif must have a parameter")
        var param=params[0];
        var error_message="%name% is required beacause "+param+" is provided";
        if(!val && payload[param]) return error_message;
        return null;
    },
    min:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule min must have a parameter")
        if(val==undefined && val==null) return null;
        if(typeof val!="number") return "%name% must be atleast "+params[0];
        return val>=Number(params[0])?null:("%name% must be atleast "+params[0])
    },
    max:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule max must have a parameter")
        if(val==undefined && val==null) return null;
        if(typeof val!="number") return "%name% must be atmost "+params[0];
        return val<=Number(params[0])?null:("%name% must be atmost "+params[0])
    },
    minlength:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule minlength must have a parameter")
        if(val==undefined && val==null) return null;
        if(typeof val!="string") return "%name% must be of atleast "+params[0]+" characters";
        return val.length>=Number(params[0])?null:("%name% must be of atleast "+params[0]+" characters")
    },
    maxlength:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule maxlength must have a parameter")
        if(val==undefined && val==null) return null;
        if(typeof val!="string") return "%name% must be of atmost "+params[0]+" characters";
        return val.length<=Number(params[0])?null:("%name% must be of atmost "+params[0]+" characters")
    },
    date:(val,params)=>{
        if(val==undefined && val==null) return null;
        if(typeof val!="string"){
            if(val instanceof Date) return null;
            return "%name% must be a date";
        }
        if(params.length==0){
            return isNaN(Date.parse(val))?"%name% must be a date":null;
        }else
            return "%name% must be a date";
    },
    digit:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule digit must have a parameter")
        if(val==undefined || val==null) return null;
        params=Number(params[0]);
        var error_message="%name% must have "+params+" digits";
        if(typeof val=="number"){
            return String(val).length==params?null:error_message;
        }else
            return error_message;
    },
    mindigit:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule digit must have a parameter")
        if(val==undefined || val==null) return null;
        params=Number(params[0]);
        var error_message="%name% must have atleast "+params+" digits";
        if(typeof val=="number"){
            return String(val).length>=params?null:error_message;
        }else
            return error_message;
    },
    maxdigit:(val,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule digit must have a parameter")
        if(val==undefined || val==null) return null;
        params=Number(params[0]);
        var error_message="%name% must have atmost "+params+" digits";
        if(typeof val=="number"){
            return String(val).length<=params?null:error_message;
        }else
            return error_message;
    },
    uppercase:(val)=>{
        if(!val) return null;
        var error_message="%name% must have all uppercase characters";
        if(typeof val=="string"){
            return val.toUpperCase()==val?null:error_message;
        }else
            return error_message;
    },
    lowercase:(val)=>{
        if(!val) return null;
        var error_message="%name% must have all lowercase characters";
        if(typeof val=="string"){
            return val.toLowerCase()==val?null:error_message;
        }else
            return error_message;
    },
    same:(val,params,payload)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule same must have a parameter")
        var param=params[0];
        var error_message="%name% must be same as "+param;
        if(!val) return error_message;
        if(param.indexOf('.')>=0){
            let nested_paths=param.split('.');
            let obj=payload[nested_paths[0]];
            for(let i=1;i<nested_paths.length;i++){
                if(!obj) return error_message;
                obj=obj[nested_paths[i]];
            }
            if(!obj) return error_message;
            return val==obj?null:error_message;
        }else{
            if(!(payload && payload[param])) return error_message;
            return val==payload[param]?null:error_message;
        }
    },
    accepted:(val)=>{
        return val?null:"%name% must be accepted";
    },
    range:(val,params)=>{
        if(params.length!=2){
            throw new Error("Syntax Error: Rule range must have two parameters")
        }else{
            if(val==undefined) return null;
            let min=Number(params[0]);
            let max=Number(params[1]);
            if(isNaN(min) || isNaN(max)) throw new Error("Syntax Error: Parameters of range rule must be number");
            return (val>=min && val<=max)?null:('%name% must be between '+min+' and '+max);
        }
    }
}