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
        if(!a) return null;
        if(typeof a!="string") return "%name% must be an email";
        return a.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)!=null?null:"%name% must be an email";
    },
    /*year:(a)=>{
        if(typeof a=="string")
    }*/
    required:a=>a!=undefined?null:"%name% is required",
    min:(a,params)=>{
        if(!a) return null;
        if(typeof a!="number") return "%name% must be atleast "+params[0];
        if(params.length==0){
            throw new Error("Syntax Error: Rule min must have a parameter")
        }else if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "%name% must be atleast "+path;
        }else
            return a>=Number(params[0])?null:("%name% must be atleast "+params[0])
    },
    max:(a,params)=>{
        if(!a) return null;
        if(typeof a!="number") return "%name% must be atmost "+params[0];
        if(params.length==0){
            throw new Error("Syntax Error: Rule max must have a parameter")
        }else if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "%name% must be atmost "+path;
        }else
            return a<=Number(params[0])?null:("%name% must be atmost "+params[0])
    },
    minlength:(a,params)=>{
        if(!a) return null;
        if(typeof a!="string") return "%name% must be of atleast "+params[0]+" characters";
        if(params.length==0){
            throw new Error("Syntax Error: Rule minlength must have a parameter")
        }else if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "%name% must be of atleast "+path+" characters";
        }else
            return a.length>=Number(params[0])?null:("%name% must be of atleast "+params[0]+" characters")
    },
    maxlength:(a,params)=>{
        if(!a) return null;
        if(typeof a!="string") return "%name% must be of atmost "+params[0]+" characters";
        if(params.length==0){
            throw new Error("Syntax Error: Rule maxlength must have a parameter")
        }else if((params[0].startsWith("\"") && params[0].endsWith("\"")) || (params[0].startsWith("'") && params[0].endsWith("'"))){
            var path=params[0].substr(1,params[0].length-2);
            return "%name% must be of atmost "+path+" characters";
        }else
            return a.length<=Number(params[0])?null:("%name% must be of atmost "+params[0]+" characters")
    },
    date:(a,params)=>{
        if(!a) return null;
        if(typeof a!="string"){
            if(a instanceof Date) return null;
            return "%name% must be a date";
        }
        if(params.length==0){
            return isNaN(Date.parse(a))?"%name% must be a date":null;
        }else
            return "%name% must be a date";
    },
    //mindigits:(a,params)=>
    //maxdigits
    //uppercase
    //lowercase
}