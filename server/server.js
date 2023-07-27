const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
//added the authMiddleware and signToken to the server.js file
const { authMiddleware, signToken } = require('../server/utils/auth');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//creating the apollo server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  //adding the context to be able to access request headers in our resolvers
  // context: ({ req }) => req.headers
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(routes);

async function startApolloServer() {
  await server.start();
  // Adding the authMiddleware to the Express.js server after the Apollo Server is started
  server.applyMiddleware({ app });
  app.use(authMiddleware);
  // Apply the Apollo Server middleware to your Express app

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  })
};
startApolloServer();


