import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  # Boilerplate
  type Lien {
    county: String!
  }
  type Query {
    lien: Lien!
  }
`;

const resolvers = {
  Query: {
    lien: () => ({ county: 'Asbury Park' })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
