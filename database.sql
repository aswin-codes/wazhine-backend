/* For Creating database*/
CREATE DATABASE wazhine;

/*For Creating User Table*/
CREATE TABLE user_table (
    user_id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(15),
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'customer'
);

/*For creating Laundry Shop Table*/
CREATE TABLE laundry_shop (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_path VARCHAR(255),
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_id INT REFERENCES user_table(user_id) NOT NULL
);

/*For creating Reviews Table */
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL,
    description TEXT,
    shop_id INT REFERENCES laundry_shop(id) NOT NULL,
    user_id INT REFERENCES user_table(user_id) NOT NULL,
    date_created TIMESTAMP DEFAULT current_timestamp
);

/*For creating orders Table*/
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    shop_id INT REFERENCES laundry_shop(id) NOT NULL,
    clothes JSONB NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    order_date TIMESTAMP DEFAULT current_timestamp
);

ALTER TABLE orders
ADD COLUMN user_id INT;

ALTER TABLE orders
ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES user_table (user_id);



