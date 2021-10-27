import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    password: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    likes: Int!
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

  input updatePersonInput {
    firstName: String
    lastName: String
  }

  type Mutation {
    signup(input: newUserInput): AuthPayload!
    login(input: LoginInput): AuthPayload!
    updateUser(input: updatePersonInput email: String!): User!
    deleteUser(email: String!): User
    newPost(title: String! content: String!): Post!
    likePost(id: ID!): Post!
  }

  type AuthPayload {
    token: String!
  }

  type Subscription {
    userCreated: User!
    postCreated: Post!
    likeCreated: Post!
  }
`;

export default typeDefs;
