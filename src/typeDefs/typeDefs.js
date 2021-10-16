import { gql } from 'apollo-server-express'

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

  type Mutation {
    newPerson(
      id: ID!
      firstName: String!
      lastName: String!
      age: Int!
      role: String!
    ): Person
  }

  type Subscription {
    personCreated: Person!
  }
`

export default typeDefs