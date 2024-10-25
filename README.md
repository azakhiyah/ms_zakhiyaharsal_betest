# ms_zakhiyaharsal_betest

## Description

This project is a microservices application built with Node.js and Express, designed for CRUD (Create, Read, Update, Delete) operations. The application manages user data, storing it in MongoDB for persistent storage and using Redis for caching to enhance performance.

## User Data Structure

The user data includes the following fields:
- **Id**: Unique identifier for the user
- **userName**: The name of the user
- **accountNumber**: The user's account number
- **emailAddress**: The user's email address
- **identityNumber**: The user's identity number

## Features

For detailed information on the available routes and features, please refer to the `userRoute.js` file in the project.

## Deployment

This project is successfully deployed on Render and can be accessed at the following URL:

[https://ms-zakhiyaharsal-betest.onrender.com](https://ms-zakhiyaharsal-betest.onrender.com)

## Postman Collection

A Postman collection is included in the repository (`userTestpostman_collection.json`) for testing the API endpoints. You can import this collection into Postman to easily test the CRUD operations available in this microservice.


## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/azakhiyah/ms_zakhiyaharsal_betest.git


2. Navigate into project directory:
   ```bash
   cd ms_zakhiyaharsal_betest

3. Install the dependencies:
   ```bash
   npm install

4. Create a .env file in the root directory and add your MongoDB and Redis configuration settings.

5. Run the application:
   ```bash
   NPM start