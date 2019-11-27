# Gateman
Simple and easiest JSON validator for nodejs

# Syntax
``` gateman(schema [, message [, custom] ]) ```
Returns a [validator function](#validator-function)

### Parameters
- **schema** - Object
 JSON based schema ( see [schema](#schema) )
- **message** - Object (OPTIONAL)
 JSON based [messages](#messages)
- **custom** - Object (OPTIONAL)
 [Custom validation](#custom-validation) rules

### Example
```javascript
var gateman = require('gateman');
var validate = gateman({
		name: "required",
		age: "required | adult"
	},{
		name: "Please provide your name"
	},{
		adult: (value)=>value<18?"Only adults are allowed":null
	});
var error = validate({name: "Koushik Seal", age: 9});
if(!error)
	console.log("Valid");
else
	console.log(JSON.stringify(error, null, 2));
```
will log the follwing
```json
{
	"name": "Please provide your name",
	"age": { "adult": "Only adults are allowed" }
}
```

# Schema
JSON with rules seperated by ```|```
```javascript
{
    name:"string|required"
}
```

# Messages
JSON based custom messages similar to input JSON with rule specific message.
```javascript
{
    name:{
        required: "Please enter name"
    }
}
```
Specifying messages to keys will ignore all rule specific messages for that key
```javascript
{
    name: "Please provide a valid name"
}
```
The above JSON will show the error message on any of ```string``` or ```required``` check

# Validator Function

### Syntax
``` function(json [, options]) ```
Returns ```null``` if no error, otherwise returns [validation error](#validation-error)
### Parameters
1. **json** - Object
	JSON payload to be validated
2. **options** - Object (OPTIONAL)
	[Validation options](#validation-options)

# Validation Options
- **flatten** - Boolean
	Flat error object. ``` false ``` by default.
	Example:
	```javascript
	var validate = gateman( { name: "uppercase" } );
	var error = validate( { name: "hello" }, { flatten: true } );
	console.log( JSON.stringify( error, null, 2) );
	```
	will log the following:
	```json
	{
		"name.uppercase": "name must have all uppercase characters",
	}
	```

# Validation Error
This is basically a JSON similar to the input JSON with error messages
```javascript
{
    name:{
        required: "name is required"
    }
}
```

# Custom Validation
JSON object where each keys are functions. These functions should return ```null``` if no error, and should return error message on error. The first argument is the value from input payload and the second argument is the parameters passed to the rule through schema definition.
> ***Note***: Existing rules can be overridden by custom validation

### Syntax
```javascript
{
    custom_rule_name : function(value, parameters){//parameters is an array
        if(value==undefined) return "Your custom error message";
        return null; //everything is fine
    }
}
```

### Example
```javascript
{
    odd:function(value){
        return value/2==0?"Value must be odd":null;
    }
}
```