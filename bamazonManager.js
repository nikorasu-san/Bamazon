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

// Display title banner
let banner = figlet.textSync(`BAMAZON\b\nManager`, {
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



// define function to pull up home menu
function menuManager() {
    // ask the user to chose from a list of actions
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [colors.green.inverse.bold("View Products for Sale"), colors.magenta.inverse.bold("View Low Inventory"), colors.yellow.inverse.bold("Add to Inventory"), colors.blue.inverse.bold("Add New Product"), colors.bold("Exit")],
            name: "command"
        }
    ]).then(function (answers) {
        // call function based on selected action
        switch (answers.command) {
            case colors.green.inverse.bold("View Products for Sale"): viewProducts();
                break;
            case colors.magenta.inverse.bold("View Low Inventory"): viewLow();
                break;
            case colors.yellow.inverse.bold("Add to Inventory"): addStock();
                break;
            case colors.blue.inverse.bold("Add New Product"): newProduct();
                break;
            case colors.bold("Exit"): connection.end();
                break;
            default: console.log("Please restart the program.");
        }
    })
};



// define function to see all products in stock
function viewProducts() {
    // query products table for products in stock
    connection.query('SELECT * from products WHERE stock_quantity > 0', function (error, results) {
        if (error) throw error;
        console.table(colors.green.bold("Products in stock:"), results)
        // send user back to home screen
        menuManager();
    });
}

// define function to view inventory lower than 5
function viewLow() {
    // query products table for items with less than 5 units
    connection.query('SELECT item_id, product_name, stock_quantity from products WHERE stock_quantity < 5', function (error, results, fields) {
        if (error) throw error;
        console.table(colors.magenta.bold("Products with less than 5 in stock:"), results)
        // send user back to home screen
        menuManager();
    });
}

// define function to add inventory for an item
function addStock() {
    // ask questions about the new product
    inquirer.prompt([
        {
            message: colors.yellow("Which item id do you want to restock?"),
            name: "item_id"
        },
        {
            message: colors.yellow("How many units are you adding to the stock?"),
            name: "add"
        }
    ]).then(function (answers) {
        if (answers.item_id.trim() === "") {
            console.log(colors.red.bold("Sorry. The item id appeared to be blank. Please try this action again."));
            // return user to home menu
            menuManager();
        } else if (answers.add.trim() === "") {
            console.log(colors.red.bold("Sorry. The stock addition appeared to be blank. Please try this action again."));
            // return user to home menu
            menuManager();
        } else {
            // initialize stock variable
            let stock = 0;
            // query database to get current item quantity
            connection.query(`SELECT stock_quantity FROM products WHERE item_id=${answers.item_id}`, function (error, firstResult) {
                if (!firstResult.length) {
                    // if no results, let user know and send back to main menu
                    console.log(colors.bold(`This item id is not in the database.`));
                    menuManager();
                } else {
                    // add current stock to user input
                    stock = parseInt(firstResult[0].stock_quantity);
                    newStock = stock + parseInt(answers.add)
                    // push updated stock count to products table in database
                    connection.query(`UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${answers.item_id}`, function (error, results, fields) {
                        if (error) throw error;
                        console.log(colors.yellow.bold("Restock complete"))
                        // send user back to home screen
                        menuManager();
                    })
                }
            })
        }
    })
}

// function to add a new product
function newProduct() {
    // define the choices array for a later question
    var deptArray = [];
    // query database for existing departments
    connection.query(`SELECT department_name FROM departments ORDER BY department_name ASC`, function (error, results) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            // push existing departments into the array
            deptArray.push(results[i].department_name);
        }
        // ask questions about the new products
        inquirer.prompt([
            {
                message: colors.blue("What is the product name?"),
                name: "product_name"
            },
            {
                message: colors.blue("Which department does this product belong to?"),
                name: "department_name",
                type: "list",
                // use the array from before as the choices in this question
                choices: deptArray
            },
            {
                message: colors.blue("What is the price per unit?"),
                name: "price"
            },
            {
                message: colors.blue("How many units are being stocked?"),
                name: "stock_quantity"
            }
        ]).then(function (input) {
            // check if any information is blank
            if (input.product_name.trim() === "" || input.price.trim() === "" || input.stock_quantity.trim() === "") {
                console.log(colors.red.bold("Sorry. One of the new product details appeared to be blank. Please try this action again."));
                // return user to home menu
                menuManager();
            } else {
                // add the new product to the products table
                connection.query(`INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES ("${input.product_name}","${input.department_name}",${input.price},${input.stock_quantity})`, function (error, results) {
                    if (error) throw error;
                    console.log(colors.green("The new product was added"));
                    // send user back to home screen
                    menuManager();
                })
            }

        })
    })
}


// show welcome
console.log(colors.rainbow(banner));
// start app workflow after the title banner appears
menuManager();
