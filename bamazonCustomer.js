// initialize npm modules
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const figlet = require('figlet');
const colors = require('colors');

// update the connection details below if you are running this locally
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();

// define home screen when app starts
let title = figlet.textSync(`Welcome\b\n to\b\n BAMAZON!`, {
    font: 'Varsity',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

// show welcome banner
console.log(colors.rainbow(title))
// start app after title appears
homeCustomer()

function homeCustomer() {
    // ids, names, and prices of products for sale
    connection.query('SELECT item_id, product_name, price, stock_quantity from products WHERE stock_quantity > 0', function (error, results, fields) {
        if (error) throw error;
        console.table(colors.green("These are the products we have in stock:"), results)
        // call function to take the customer's order
        orderPrompt()
    });
}


// define function to take an order
function orderPrompt() {
    // ask which item_id do you want to buy & how many units
    inquirer.prompt([
        {
            message: colors.blue("Please enter the ID number that you want to buy."),
            name: "item_id"
        },
        {
            message: colors.blue("How many do you want to buy?"),
            name: "quantity"
        }
    ]).then(function (answers) {
        // query database for data on this item id
        connection.query(`SELECT stock_quantity, product_name, price from products WHERE item_id = ${answers.item_id}`, function (error, results) {
            if (error) throw error;
            // check if there are any results
            if (!results.length) {
                // if no, message user and ask if they want to continue
                console.log(colors.bold(`The item id is not in our database.`));
                backToStart();
            } else {
                // define variables from query data 
                let inStock = results[0].stock_quantity;
                let price = results[0].price;
                let productName = results[0].product_name;
                // define what the new stock would be after purchase
                let difference = inStock - answers.quantity
                // verify that the "new stock" value would be above zero, before making purchase
                if (difference > 0) {
                    // console.log(`You can buy ${answers.quantity} ${results[0].product_name}(s)`)
                    // process the purchase
                    purchaseMade(difference, answers, price, productName)
                } else {
                    console.log(colors.bold("Sorry. We don't have enough stock for this purchase."))
                    // ask the user if they want to continue
                    backToStart()
                }
            }

        });

    })
}


// define function to make purchase. The arguments include the new stock, user answers, item price, and item name.
function purchaseMade(num, answers, cost, item) {
    // define variable that totals the user spend
    let total = answers.quantity * cost;
    // query database for past product sales for the ordered item
    connection.query(`SELECT product_sales FROM products WHERE item_id = ${answers.item_id}`, function (error, results) {
        // store product_sales data from query
        let productSales = results[0].product_sales;
        // store a calculation of adding the order total to the historic product sales for that item.
        let updatedSales = productSales + total;
        // update database with the new stock_quantity and updated product_sales for ordered item
        connection.query(`UPDATE products SET stock_quantity=${num}, product_sales = ${updatedSales} WHERE item_id = ${answers.item_id}`, function (error, results) {
            if (error) throw error;
            //console.log("stock updated")
            // order confirmation
            console.log(colors.green(`Thanks for spending $${total} with us. Here are your ${answers.quantity} ${item}(s).`))
            // ask user if they want to continue
            let asyncBackToStart = backToStart()
        });
    })
}

// define a function that asks the user if they want to continue
function backToStart() {
    inquirer.prompt([
        {
            type: "confirm",
            message: colors.yellow("Would you like to make another purchase?"),
            name: "continue"
        }
    ]).then(function (reply) {
        if (reply.continue) {
            homeCustomer()
        } else {
            connection.end()
        }
    })
}

