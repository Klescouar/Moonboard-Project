const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const Article = require("./models/Article");
const User = require("./models/User");
const Chapter = require("./models/Chapter");
const { apolloUploadExpress } = require("apollo-upload-server");

// Bring in GraphQL-Express middleware
const { ApolloServer, gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Connects to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// Initializes application
const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true
// };
app.use(cors("*"));

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (err) {}
  }
  next();
});

// Connect schemas with GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({
    req: {
      res: {
        req: { currentUser }
      }
    }
  }) => ({
    currentUser: currentUser,
    Article: Article,
    User: User,
    Chapter: Chapter
  })
});
server.applyMiddleware({ app });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
