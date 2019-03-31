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
// initialize departments array

function homeSupervisor() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            name: "command"
        }
    ]).then(function (answers) {
        switch (answers.command) {
            case "View Product Sales by Department": viewDeptSales();
                break;
            case "Create New Department": createDept();
                break;
            case "Exit": connection.end();
                break;
            default: console.log("how did you get here")
        }
    })
};


function viewDeptSales() {
    connection.query(`SELECT a.department_id, a.department_name, a.over_head_costs, sum(b.product_sales) as product_sales, (sum(b.product_sales)-a.over_head_costs) as total_profit
    FROM departments a JOIN products b ON a.department_name = b.department_name
    GROUP BY department_id,department_name`, function (error, results, fields) {
            if (error) throw error;
            console.table("Department Sales:", results)
            homeSupervisor();
        });
}

function createDept() {
    // show existing departments
    connection.query(`SELECT department_name FROM departments`, function (error, results) {
        if (error) throw error;
        console.table("CURRENT DEPARTMENTS", results)
        // ask questions
        inquirer.prompt([
            {
                message: "What is the new Department's name?",
                name: "department_name"
            },
            {
                message: "What are the over head costs? (no commas)",
                name: "over_head_costs"
            }
        ]).then(function (answers) {
            // get department names
            var deptArray = [];
            connection.query(`SELECT department_name FROM departments`, function (error, results) {
                if (error) throw error;
                for (var i = 0; i < results.length; i++) {
                    deptArray.push(results[i].department_name.toLowerCase());
                    //console.log(deptArray)
                }
                console.log(deptArray)
                if (deptArray.includes(answers.department_name.toLowerCase())) {
                    console.log("Sorry. This department name already exists.");
                    homeSupervisor();
                } else {
                    // console.log("carry on")
                    connection.query(`INSERT INTO departments(department_name,over_head_costs) VALUES("${answers.department_name}",${answers.over_head_costs})`, function (error, results) {
                        if (error) throw error;
                        console.log("new department added")
                        homeSupervisor();
                    })
                }
            })
        })
        // end table display
    })
}

function showDepartments() {
    connection.query(`SELECT department_name FROM departments`, function (error, results) {
        if (error) throw error;
        console.table("Current Departments", results)
        // for (var i = 0; i < results.length; i++) {
        //     //console.log(deptArray)
        // }
        // return deptArray;
    })
}


// call stack
homeSupervisor()