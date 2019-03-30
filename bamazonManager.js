// initialize npm modules
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();

function homeManager() {
    inquirer.prompt([
        {
            type: "list",
            message: "Hello, Manager. What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "command"
        }
    ]).then(function (answers) {
        switch (answers.command) {
            case "View Products for Sale": viewProducts();
                break;
            case "View Low Inventory": console.log("b"); backToStart();
                break;
            case "Add to Inventory": console.log("c"); backToStart();
                break;
            case "Add New Product": console.log("d"); backToStart();
                break;
            default: console.log("how did you get here")
        }
    })
};

// start call stack
homeManager()

function viewProducts() {
    connection.query('SELECT item_id, product_name, price, stock_quantity from products WHERE stock_quantity > 0', function (error, results, fields) {
        if (error) throw error;
        console.table("Products in stock:", results)
        backToStart();
    });
}

// Ask the user if they want to run the app again or quit
function backToStart() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to make another action?",
            name: "continue"
        }
    ]).then(function (answer) {
        if (answer.continue) {
            homeManager()
        } else {
            connection.end()
        }
    })
}