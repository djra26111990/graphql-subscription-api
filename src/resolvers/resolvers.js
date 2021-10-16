import { PubSub } from "graphql-subscriptions";


const pubsub = new PubSub();

const personas = [
    {
      id: "1",
      firstName: "Daniel",
      lastName: "Rivas",
      age: 30,
      role: "admin",
    },
    {
      id: "2",
      firstName: "Marelys",
      lastName: "Escobar",
      age: 26,
      role: "user",
    },
    {
      id: "3",
      firstName: "John",
      lastName: "Doe",
      age: 999999,
      role: "user",
    },
  ];

const resolvers = {
    Query: {
      personCount: () => personas.length,
      allPersons: () => personas,
      findPerson: (root, args) => {
        const { firstName } = args;
        return (
          personas.find((persona) => persona.firstName === firstName) || {
            id: "".trim(),
            age: 0,
            firstName: "".trim(),
            lastName: "".trim(),
            fullName: "".trim(),
          }
        );
      },
    },
    Person: {
      fullName: (root) => `${root.firstName} ${root.lastName}`,
      canDrink: (root) => root.age > 18,
      isAdmin: (root) => root.role === "admin",
    },
    Mutation: {
      newPerson: (root, args) => {
        const { id, firstName, lastName, age, role } = args;
        const person = {
          id,
          firstName,
          lastName,
          age,
          role,
        };
        personas.push(person);
        pubsub.publish("NEW_PERSON", { personCreated: person });
        return personas.find((persona) => persona.firstName === firstName);
      },
    },
    Subscription: {
      personCreated: {
        subscribe: () => pubsub.asyncIterator("NEW_PERSON"),
      },
    },
  };

  export default resolvers