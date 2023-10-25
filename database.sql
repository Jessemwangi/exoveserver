-- create the database and enter into the database instance
CREATE DATABASE products;
use products;

-- Create the products table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create the categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the categories table
CREATE TABLE productCategories (
    product_id VARCHAR(36),
   categoryid VARCHAR(36),
    FOREIGN KEY (productid) REFERENCES products(id),
     FOREIGN KEY (categoryid) REFERENCES categories(id)
);

-- Create the variations table with a generic key-value structure and  base currency to support multiple currencies
CREATE TABLE variations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productid VARCHAR(36),
    key_name VARCHAR(255) NOT NULL,
    value_name VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
     currency VARCHAR(3) NOT NULL,
    FOREIGN KEY (productid) REFERENCES products(id)
);


-- Create the product_translations table
CREATE TABLE product_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productid VARCHAR(36),
    language VARCHAR(4) NOT NULL,
    translation TEXT,
    FOREIGN KEY (productid) REFERENCES products(id)
);
