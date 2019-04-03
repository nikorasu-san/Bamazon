// initialize npm modules
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
const colors = require('colors');
const figlet = require('figlet');

// update the connection details below if you are running this locally
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect();
// initialize departments array

// Display title banner
let banner = figlet.textSync(`BAMAZON\b\nSupervisor`, {
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

// main menu function
function menuSupervisor() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [colors.green.inverse.bold("View Product Sales by Department"), colors.blue.inverse.bold("Create New Department"), colors.bold("Exit")],
            name: "command"
        }
    ]).then(function (answers) {
        // call function based on user selection
        switch (answers.command) {
            case colors.green.inverse.bold("View Product Sales by Department"): viewDeptSales();
                break;
            case colors.blue.inverse.bold("Create New Department"): createDept();
                break;
            case colors.bold("Exit"): connection.end();
                break;
            default: console.log("Please restart the program.")
        }
    })
};


function viewDeptSales() {
    // query database for information on sales per department and calculate total profit
    connection.query(`SELECT a.department_id, a.department_name, a.over_head_costs, sum(b.product_sales) as product_sales, (sum(b.product_sales)-a.over_head_costs) as total_profit
    FROM departments a JOIN products b ON a.department_name = b.department_name
    GROUP BY department_id,department_name`, function (error, results) {
            if (error) throw error;
            // display data in a table
            console.table(colors.green.bold("Department Sales:"), results)
            // return user to home menu
            menuSupervisor();
        });
}

function createDept() {
    // create an array for department name validation later
    var deptArray = [];
    // show existing departments
    connection.query(`SELECT department_name FROM departments ORDER BY department_name ASC`, function (error, results) {
        if (error) throw error;
        console.table(colors.blue.bold("CURRENT DEPARTMENTS"), results)
        for (var i = 0; i < results.length; i++) {
            // push lowercase department names into array
            deptArray.push(results[i].department_name.toLowerCase());
        }
        // ask questions about new department
        inquirer.prompt([
            {
                message: colors.blue.bold("What is the new Department's name?"),
                name: "department_name"
            },
            {
                message: colors.blue.bold("What are the overhead costs? (no commas)"),
                name: "over_head_costs"
            }
        ]).then(function (answers) {
            // check if lowercase version of user input matches an entry in the dept array before adding it to the database
            if (deptArray.includes(answers.department_name.toLowerCase())) {
                console.log(colors.red.bold("Sorry. This department name already exists."));
                // return user to home menu
                menuSupervisor();
            } else if (answers.department_name.trim() === "") {
                console.log(colors.red.bold("Sorry. The new department name appeared to be blank. Please try this action again."));
                // return user to home menu
                menuSupervisor();
            } else if (answers.over_head_costs.trim() === "") {
                console.log(colors.red.bold("Sorry. The new department's overhead costs appeared to be blank. Please try this action again."));
                // return user to home menu
                menuSupervisor();
            } else {
                // add new department to database
                connection.query(`INSERT INTO departments(department_name,over_head_costs) VALUES("${answers.department_name}",${answers.over_head_costs})`, function (error, results) {
                    if (error) throw error;
                    console.log(colors.blue("New department added!"))
                    // return user to home menu
                    menuSupervisor();
                })
            }
        })
    })
}

// show welcome
console.log(colors.rainbow(banner))
// start app workflow after the title banner appears
menuSupervisor();