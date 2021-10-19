import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    password: String!
  }

  type Query {
    userCount: Int!
    allUsers: [User]!
    findUser(firstName: String!): User
  }

  input newUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    signup(input: newUserInput): AuthPayload!
    login(input: LoginInput): AuthPayload!
  }

  type AuthPayload {
    token: String!
  }

  type Subscription {
    userCreated: User!
  }
`;

export default typeDefs;
