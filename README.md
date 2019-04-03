# Bamazon
Objective: Create an command line app that will take in orders from customers and deplete stock from the store's inventory. 

## Overview
Welcome to my mock store, Bamazon! A place where you are invited to do some pretend guilt-less shopping as a customer or be a demigod of an employee. Bamazon has three different modes: customer, manager, and supervisor. 

The customer will be able to make purchases based on limited data in the database. The manger is able to see more information on products along with the ability to restock and add new products. The supervisor has the ability to see total profits per department and create new departments.

This app was build with Node.js and using a mySQL database. If you plan to run this app locally, please note the sql files for setting up the database and that the connection details for each javascript file should be updated.

## Instructions
For Customers:
1. Run bamazonCustomer.js in your terminal.
2. Information about the items currently in stock will display.
3. Following the data are 2 prompts asking you for the item_id and the quantity for your purchase, respectively
4. Next the app will display a confirmation or error message for your purchase.
5. Finally, the app will ask you if you want to make another purchase. "n" or "no" will exit the program.

For Managers:
1. Run bamazonManager.js in your terminal.
2. The app will display a main menu of 5 options.
    * "View Products for Sale" - Displays product data for items in stock.
    * "View Low Inventory" - Displays product data for items with less than 5 units in stock.
    * "Add to Inventory" - Prompts the user to provide details necessary to restock a product. Then, increases the product's stock. 
    * "Add New Product" - Prompts the user for product information to supply a brand new product.
    * "Exit" - Will stop the program.
3. All actions except exit should return the user to the main menu.

For Supervisors:
1. Run bamazonSupervisor.js in your terminal.
2. The app will display a main menu of 3 options.
    * "View Product Sales by Department" - Displays sales data for any department that has had a product stocked.
    * "Create New Department" - Displays existing department names for reference and asks the user to provide a department name and overhead costs for the new department.
    * "Exit" - Will stop the program.
3. All actions except exit should return the user to the main menu.

## Tech Used
* Node.js
* mySQL database
* Dependencies noted in package.json
   - "colors": "^1.3.3",
   - "console.table": "^0.10.0",
   - "figlet": "^1.2.1",
   - "inquirer": "^6.2.2",
   - "mysql": "^2.16.0"

## Future Development
* Allow a shopping cart or some other method for customers to purchase more than one product/item_id at a time.