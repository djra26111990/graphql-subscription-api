import { PubSub } from "graphql-subscriptions";
import Person from "../models/persons.models.js";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    personCount: async () => Person.countDocuments({}),
    allPersons: async () => {
      const Personas = await Person.find().exec();
      return Personas;
    },
    findPerson: async (root, args) => {
      const { firstName } = args
      const person = await Person.find(
        {
          firstName: firstName,
        },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      ).exec()
      return person[0]
    },
  },
  Person: {
    fullName: (root) => `${root.firstName} ${root.lastName}`,
    canDrink: (root) => root.age > 18,
    isAdmin: (root) => root.role === "admin",
  },
  Mutation: {
    newPerson: (root, { input }) => {
      pubsub.publish("NEW_PERSON", { personCreated: input });
      return Person.create(input)
    },
  },
  Subscription: {
    personCreated: {
      subscribe: () => pubsub.asyncIterator("NEW_PERSON"),
    },
  },
};

export default resolvers;
