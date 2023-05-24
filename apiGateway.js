const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { express: expressMiddleware } = require("@apollo/server");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mysql = require("mysql");

const movieProtoPath = "movie.proto";
const tvShowProtoPath = "tvShow.proto";

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;
const clientMovies = new movieProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const clientTVShows = new tvShowProto.TVShowService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

// Configure your SQL database connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(expressMiddleware(server));
});

app.get("/movies", (req, res) => {
  const query = "SELECT * FROM movies";

  connection.query(query, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error retrieving movies from the database" });
    } else {
      res.json(results);
    }
  });
});

app.post("/movies", (req, res) => {
  const { id, title, description } = req.body;
  const query = "INSERT INTO movies (id, title, description) VALUES (?, ?, ?)";

  connection.query(query, [id, title, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error creating a movie in the database" });
    } else {
      res.json({ id, title, description });
    }
  });
});

app.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM movies WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error retrieving movie from the database" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Movie not found" });
      } else {
        res.json(results[0]);
      }
    }
  });
});

app.get("/tvshows", (req, res) => {
  const query = "SELECT * FROM tvshows";

  connection.query(query, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error retrieving TV shows from the database" });
    } else {
      res.json(results);
    }
  });
});

app.get("/tvshows/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM tvshows WHERE id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error retrieving TV show from the database" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "TV show not found" });
      } else {
        res.json(results[0]);
      }
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
