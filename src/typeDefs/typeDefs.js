import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    age: Int!
    role: String!
    canDrink: Boolean!
    isAdmin: Boolean!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(firstName: String!): Person
  }

  input PersonInput {
    firstName: String!
    lastName: String!
    age: Int!
    role: String!
  }

  type Mutation {
    newPerson(input: PersonInput): Person
  }

  type Subscription {
    personCreated: Person!
  }
`;

export default typeDefs;
