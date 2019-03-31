DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INTEGER(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(35) NOT NULL,
department_name VARCHAR(20),
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(10) DEFAULT 0,
product_sales DECIMAL(10,2) NULL DEFAULT 0
);

CREATE TABLE departments(
department_id INTEGER(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(20),
over_head_costs DECIMAL(10,2) NOT NULL
);