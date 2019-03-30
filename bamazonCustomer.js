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
// define home screen when app starts
console.log(`Welcome to BAMAZON!`)
function homeCustomer() {
    // ids, names, and prices of products for sale
    connection.query('SELECT item_id, product_name, price, stock_quantity from products WHERE stock_quantity > 0', function (error, results, fields) {
        if (error) throw error;
        console.table("These are the products we have in stock:", results)
        orderPrompt()
    });
}

// call stack
homeCustomer()

// take an order
function orderPrompt() {
    // which id do you want to buy? && how many units
    inquirer.prompt([
        {
            message: "Please enter the ID number that you want to buy.",
            name: "item_id",
        },
        {
            message: "How many do you want to buy?",
            name: "quantity"
        }
    ]).then(function (answers) {
        console.log(answers)
        // item id chosen is compared with stock quantity
        connection.query(`SELECT stock_quantity, product_name, price from products WHERE item_id = ${answers.item_id}`, function (error, results) {
            if (error) throw error;
            let inStock = results[0].stock_quantity;
            let price = results[0].price;
            let difference = inStock - answers.quantity
            if (difference > 0) {
                console.log(`You can buy ${answers.quantity} ${results[0].product_name}(s)`)
                purchaseMade(difference, answers, price)

            } else {
                console.log("We don't have enough stock for this purchase")
                console.log("Would you like to make another purchase?")
                backToStart()
            }

            // connection.end()
        });

    })
}


// make purchase
function purchaseMade(num, answers, cost) {
    // update the database to have the new number
    console.log("cost: ", cost)
    // console.log("total: ", total)
    connection.query(`UPDATE bamazon.products SET stock_quantity=${num} WHERE item_id = ${answers.item_id}`, function (error, results) {
        if (error) throw error;
        console.log("stock updated")
        //receipt object.quanity * price
        let total = answers.quantity * cost;
        console.log(`Thanks for spending $${total} with us.`)
    });


    // return to home screen
    backToStart()
}

function backToStart() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to make another purchases?",
            name: "continue"
        }
    ]).then(function (answer) {
        if (answer.continue) {
            homeCustomer()
        } else {
            connection.end()
        }
    })
}

