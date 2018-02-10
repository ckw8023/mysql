//require decleration
var mysql = require("mysql");
var inquirer = require("inquirer");
//global variable decleration
var id = new Array();
var price = new Array();
var quantity = new Array();
//connect to MySql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zyq80233",
    database: "bamazon"
});
//get data from MySql database
function showItem(){
    console.log("Print item from store");
    //display table to user
    connection.query("SELECT item_id,product_name,price FROM products",
    function(err,res){
        if(err) throw err;
        console.log(res);
        res.forEach(function(element){
            id.push(element.item_id);
            price.push(element.price);
        });
    });
    //get quantity info
    connection.query("SELECT stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (element) {
            quantity.push(element.stock_quantity);
        });
    });
    console.log(id);
    console.log(price);
    console.log(quantity);
}
//upDate info in MySql database
function upDate(id,cost){
    console.log("Updata product database");
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {
            stock_quantity:cost
        },
        {
            item_id:id
        }
    ],function(err,res){
        console.log("products updated!\n");
    });
    connection.end();
}
//ternimal function, handle all the functionality
function display(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to buy?",
            choices: ["1","2","3","4","5","6","7","8","9","10"],
            name: "userItem"
        },
        {
            type: "input",
            message: "How many unit would u like to buy?",
            name: "userUnit"
        },
    ]).then(function(element){
        connection.connect(function (err, res) {
            console.log("connected as id " + connection.threadId + "\n");
            if (err) throw err;
            showItem();
            console.log("quantity array is: "+quantity);
            console.log("price array is: "+price);
            var index = element.userItem;
            var count = element.userUnit;
            var newQuantity = quantity[index-1] - count;
            var cost = price[index - 1] * quantity[index - 1];
            console.log("newQuantity is: "+newQuantity);
            if(newQuantity < 0){
                console.log("Insufficient quantity!");
                return;
            }
            else{
                upDate(index,newQuantity);
                console.log("total cost is: "+cost);
            }
        });
    });
}

display();