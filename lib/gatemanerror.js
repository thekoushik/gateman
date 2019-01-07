'use strict';
class GatemanError extends Error{
    constructor(message,index){
        super(message);
        this.index=index;
    }
}
module.exports=GatemanError;