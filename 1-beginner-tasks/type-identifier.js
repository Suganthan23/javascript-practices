let value = "zoro";

let typeOfValue = typeof value;

console.log(`the value is : ${value}`);
console.log(`the type of value is : ${typeOfValue}`);

if (typeOfValue === "string")
{
    console.log("the value is a string");
}
else if (typeOfValue === "number")
{
    console.log("the value is a number");
}
else if (typeOfValue === "boolean")
{
    console.log("the value is a boolean");
}
else if (typeOfValue === "object")
{
    console.log("the value is an object or an array");
}
else if (typeOfValue === "undefined")
{
    console.log("the value is undefined");

}
else 
    console.log("the value is of an unknown type");