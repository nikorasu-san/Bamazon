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
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "command"
        }
    ]).then(function (answers) {
        switch (answers.command) {
            case "View Products for Sale": viewProducts();
                break;
            case "View Low Inventory": viewLow();
                break;
            case "Add to Inventory": addStock();
                break;
            case "Add New Product": console.log("d"); backToStart();
                break;
            case "Exit": connection.end();
                break;
            default: console.log("how did you get here")
        }
    })
};

// start call stack
homeManager()

// define function to see all products in stock
function viewProducts() {
    connection.query('SELECT item_id, product_name, price, stock_quantity from products WHERE stock_quantity > 0', function (error, results, fields) {
        if (error) throw error;
        console.table("Products in stock:", results)
        homeManager();
    });
}

// define function to view inventory lower than 5
function viewLow() {
    connection.query('SELECT item_id, product_name, stock_quantity from products WHERE stock_quantity < 5', function (error, results, fields) {
        if (error) throw error;
        console.table("Products with less than 5 in stock:", results)
        homeManager();
    });
}

// add inventory for an item
function addStock() {
    inquirer.prompt([
        {
            message: "Which item id do you want to restock?",
            name: "item_id"
        },
        {
            message: "How many units are you adding to the stock?",
            name: "add"
        }
    ]).then(function (answers) {
        let stock = 0;
        connection.query(`SELECT stock_quantity FROM products WHERE item_id=${answers.item_id}`, function (error, firstResult) {
            stock = parseInt(firstResult[0].stock_quantity);
            newStock = stock + parseInt(answers.add)
            connection.query(`UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${answers.item_id}`, function (error, results, fields) {
                if (error) throw error;
                console.table("stock updated")
                homeManager();
            })
        })
    })
}

// 

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