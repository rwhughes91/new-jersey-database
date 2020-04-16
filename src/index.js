import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import resolvers from './resolvers';

dotenv.config();

const typeDefs = importSchema('./src/schema.graphql');
const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
