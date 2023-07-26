const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');

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
  //adding the context to be able to access request headers in our resolvers
  context: ({ req }) => req.headers
});
//adding the apollo server to our express middleware
server.applyMiddleware({ app });

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
