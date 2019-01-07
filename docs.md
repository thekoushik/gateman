# Gateman
Simple and easiest JSON validator - WIP

# Syntax
```gateman(schema,message,custom)```
Returns a [validator function](#validator-function)

### Parameters
- schema
 JSON based schema ( see [schema](#schema) )
- message (OPTIONAL)
 JSON based [messages](#messages)
- custom (OPTIONAL)
 [Custom validation](#custom-validation) rules

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

- ```function(json)```
Returns ```null``` if no error, otherwise returns [validation error](#validation-error)

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
JSON object where each keys are functions. These functions should return ```null``` if no error, and should return error message on error.
> ***Note***: Existing rules can be overridden by custom validation
### Syntax
```javascript
{
    odd:function(value){
        return value/2==0?"Value must be odd":null;
    }
}
```
