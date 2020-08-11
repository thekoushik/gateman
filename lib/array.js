module.exports={
    required:(array)=>{
        if(Array.isArray(array))
            return array.length>0?null:"Atleast one %name% is required";
        else
            return array!=undefined?null:"Atleast one %name% is required";
    },
    count:(array,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule count must have a parameter")
        const error_message="%name% must have exactly "+params[0]+" item(s)";
        if(!array) return error_message;
        if(!Array.isArray(array)) return error_message;
        return array.length!=Number(params[0])?error_message:null;
    },
    mincount:(array,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule maxcount must have a parameter")
        const error_message="%name% must have atleast "+params[0]+" item(s)";
        if(!array) return error_message;
        if(!Array.isArray(array)) return error_message;
        return array.length<Number(params[0])?error_message:null;
    },
    maxcount:(array,params)=>{
        if(params.length==0)
            throw new Error("Syntax Error: Rule maxcount must have a parameter")
        const error_message="%name% must have atmost "+params[0]+" item(s)";
        if(!array) return error_message;
        if(!Array.isArray(array)) return error_message;
        return array.length>Number(params[0])?error_message:null;
    },
}