API Gateway
The API Gateway is a component that acts as an intermediary between clients and the microservices in your system. It handles incoming requests, communicates with the appropriate microservices, and returns the response to the client. This API Gateway is built using Node.js, Express, Apollo Server, gRPC, and MySQL.

Getting Started
To set up and run the API Gateway locally, follow these steps:

Install Node.js and MySQL if they are not already installed on your system.

Clone the repository and navigate to the project directory.

Install the dependencies by running the following command:

shell
Copy code
npm install
Start the API Gateway by running the following command:

shell
Copy code
npm start
The API Gateway will start running on http://localhost:3000.

Endpoints
Movies
GET /movies

Retrieves all movies from the database.

POST /movies

Creates a new movie in the database. Requires the following parameters in the request body:

id (String): The ID of the movie.
title (String): The title of the movie.
description (String): The description of the movie.
GET /movies/:id

Retrieves a specific movie from the database based on the provided ID.

id (String): The ID of the movie.
TV Shows
GET /tvshows

Retrieves all TV shows from the database.

GET /tvshows/:id

Retrieves a specific TV show from the database based on the provided ID.

id (String): The ID of the TV show.
Database Configuration
The API Gateway connects to a MySQL database to store and retrieve movie and TV show data. The database connection details can be configured in the connection object in the code:

javascript
Copy code
const connection = mysql.createConnection({ host: "localhost", port: 3306, user: "root", password: "", database: "db", });
Make sure to update the connection details based on your MySQL database configuration. By default, the API Gateway assumes the following:

Host: localhost
Port: 3306
User: root
Password: [empty]
Database: db
You can modify these values to match your MySQL setup.

Dependencies
The API Gateway relies on the following dependencies:

express: Web framework for Node.js.
apollo-server-express: Integration of Apollo Server with Express.
body-parser: Middleware for parsing request bodies.
cors: Middleware for enabling CORS (Cross-Origin Resource Sharing).
@grpc/grpc-js: gRPC library for Node.js.
@grpc/proto-loader: Utility to load gRPC service definitions.
mysql: MySQL client library for Node.js.
These dependencies are automatically installed when you run npm install as mentioned in the Getting Started section.