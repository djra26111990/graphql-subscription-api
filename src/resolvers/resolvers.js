import { PubSub } from "graphql-subscriptions";
import User from "../models/persons.models.js";
import Post from "../models/post.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import utils from "../utils/utils.js";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    userCount: async (root, args, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      return User.countDocuments({});
    },
    allUsers: async (root, args, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      const Users = await User.find().exec();
      return Users;
    },
    findUser: async (root, { firstName }, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      const user = await User.find(
        {
          firstName,
        },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      ).exec();
      return user[0];
    },
  },
  User: {
    fullName: (root) => `${root.firstName} ${root.lastName}`,
  },
  Mutation: {
    signup: async (root, { input }) => {
      const password = await bcrypt.hash(input.password, 10);
      const newUser = {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: password,
      };

      const createUser = await User.create(newUser);

      const token = jwt.sign({ email: input.email }, utils.APP_SECRET);

      pubsub.publish("NEW_USER", { userCreated: newUser });
      return { token };
    },
    login: async (root, { input }) => {
      const user = await User.find(
        {
          email: input.email,
        },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      ).exec();

      if (!user.length) {
        throw new Error("No existe el usuario");
      }

      const valid = await bcrypt.compare(
        input.password,
        user.length ? user[0].password : ""
      );
      if (!valid) {
        throw new Error("Clave invalida");
      }

      const token = jwt.sign({ email: input.email }, utils.APP_SECRET);

      return { token };
    },
    updateUser: async (root, { input, email }, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      const updatePerson = await User.findOneAndUpdate(
        {
          email: email,
        },
        input,
        { new: true }
      );
      return updatePerson;
    },
    deleteUser: async (root, { email }, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      const deletePerson = await User.findOneAndRemove({ email });
      return deletePerson;
    },
    newPost: async (root, { title, content }, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      
      const post = {
        title,
        content,
      };
      const newPost = await Post.create(post);

      const postUpdated = await User.findOneAndUpdate(
        {
          email: context.userEmail,
        },
        { $push: { posts: newPost._id } },
        { new: true }
      );

      pubsub.publish("NEW_POST", { postCreated: newPost });

      return newPost;
    },
    likePost: async (root, { id }, context) => {
      if (!context.userEmail) throw Error("User not authenticated");
      const postUpdated = await Post.findOneAndUpdate(
        {
          _id: id,
        },
        { $inc: { likes: 1 } },
        { new: true }
      );
      pubsub.publish("NEW_LIKE", { likeCreated: postUpdated });
      return postUpdated;
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator("NEW_USER"),
    },
    postCreated: {
      subscribe: () => pubsub.asyncIterator("NEW_POST"),
    },
    likeCreated: {
      subscribe: () => pubsub.asyncIterator("NEW_LIKE"),
    },
  },
};

export default resolvers;
