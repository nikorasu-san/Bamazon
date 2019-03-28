// initialize npm modules
const inquirer = require("inquirer");
const mysql = require("mysql")
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();
// define home screen when app starts
function homeScreen() {
    console.log(`Welcome to BAMAZON!!\b\nThese are the products we have in stock:`)
    // ids, names, and prices of products for sale
    connection.query('SELECT item_id, product_name, price from products WHERE stock_quantity > 0', function (error, results, fields) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            console.log(`ID:${results[i].item_id} | product: ${results[i].product_name} | price: ${results[i].price} |`);
        }
    });
}

// call stack
homeScreen()

// take an order
function orderPrompt() {
    // which id do you want to buy? && how many units
}

// compare if we have enough stock
function stockCheck() {

}

// make purchase
function purchaseMade() {

}
