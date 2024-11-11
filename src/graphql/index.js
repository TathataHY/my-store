const { ApolloServer } = require('apollo-server-express');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');
const { buildContext } = require('graphql-passport');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const setupApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs: await typeDefs,
    resolvers,
    playground: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => buildContext({ req, res }),
  });

  await server.start();
  server.applyMiddleware({ app });
};

module.exports = setupApolloServer;
