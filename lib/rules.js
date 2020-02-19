module.exports={
    string:(a)=>{
        if(!a) return null;
        return typeof a=="string"?null:("%name% must be a string")
    },
    number:(a)=>{
        if(!a) return null;
        return typeof a=="number"?null:("%name% must be a number")
    },
    email:(a)=>{
        if(a==undefined && a==null) return null;
        if(typeof a!="string") return "%name% must be an email";
        return a.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)!=null?null:"%name% must be an email";
    },
    /*year:(a)=>{
        if(typeof a=="string")
    }*/
    required:(a)=>{
        if(typeof a=="string")
            return a.length==0?"%name% is required":null
        else
            return (a!=undefined && a!=null)?null:"%name% is required"
    },
    requiredif:(a,params,payload)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule requiredif must have a parameter")
        var param=params[0];
        var error_message="%name% is required beacause "+param+" is provided";
        if(!a && payload[param]) return error_message;
        return null;
    },
    min:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule min must have a parameter")
        if(a==undefined && a==null) return null;
        if(typeof a!="number") return "%name% must be atleast "+params[0];
        return a>=Number(params[0])?null:("%name% must be atleast "+params[0])
    },
    max:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule max must have a parameter")
        if(a==undefined && a==null) return null;
        if(typeof a!="number") return "%name% must be atmost "+params[0];
        return a<=Number(params[0])?null:("%name% must be atmost "+params[0])
    },
    minlength:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule minlength must have a parameter")
        if(a==undefined && a==null) return null;
        if(typeof a!="string") return "%name% must be of atleast "+params[0]+" characters";
        return a.length>=Number(params[0])?null:("%name% must be of atleast "+params[0]+" characters")
    },
    maxlength:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule maxlength must have a parameter")
        if(a==undefined && a==null) return null;
        if(typeof a!="string") return "%name% must be of atmost "+params[0]+" characters";
        return a.length<=Number(params[0])?null:("%name% must be of atmost "+params[0]+" characters")
    },
    date:(a,params)=>{
        if(a==undefined && a==null) return null;
        if(typeof a!="string"){
            if(a instanceof Date) return null;
            return "%name% must be a date";
        }
        if(params.length==0){
            return isNaN(Date.parse(a))?"%name% must be a date":null;
        }else
            return "%name% must be a date";
    },
    digit:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule digit must have a parameter")
        if(a==undefined || a==null) return null;
        params=Number(params[0]);
        var error_message="%name% must have "+params+" digits";
        if(typeof a=="number"){
            return String(a).length==params?null:error_message;
        }else
            return error_message;
    },
    mindigit:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule digit must have a parameter")
        if(a==undefined || a==null) return null;
        params=Number(params[0]);
        var error_message="%name% must have atleast "+params+" digits";
        if(typeof a=="number"){
            return String(a).length>=params?null:error_message;
        }else
            return error_message;
    },
    maxdigit:(a,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule digit must have a parameter")
        if(a==undefined || a==null) return null;
        params=Number(params[0]);
        var error_message="%name% must have atmost "+params+" digits";
        if(typeof a=="number"){
            return String(a).length<=params?null:error_message;
        }else
            return error_message;
    },
    uppercase:(a)=>{
        if(!a) return null;
        var error_message="%name% must have all uppercase characters";
        if(typeof a=="string"){
            return a.toUpperCase()==a?null:error_message;
        }else
            return error_message;
    },
    lowercase:(a)=>{
        if(!a) return null;
        var error_message="%name% must have all lowercase characters";
        if(typeof a=="string"){
            return a.toLowerCase()==a?null:error_message;
        }else
            return error_message;
    },
    same:(a,params,payload)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule same must have a parameter")
        var param=params[0];
        var error_message="%name% must be same as "+param;
        if(!a) return error_message;
        if(!(payload && payload[param])) return error_message;
        return a==payload[param]?null:error_message;
    },
    accepted:(a)=>{
        return a?null:"%name% must be accepted";
    }
}