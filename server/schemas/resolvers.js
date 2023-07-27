const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Define the me resolver to get the current user's data
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-password')
          .populate('savedBooks');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    // Define the login resolver to handle user login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user);
      return { token, user };
    },

    // Define the addUser resolver to handle user signup
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    // Define the saveBook resolver to save a book to the user's account
    saveBook: async (parent, { bookToSave }, context) => {
      if (context.user) {
        const updatedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookToSave } },
          { new: true }
        ).populate('savedBooks');

        return updatedBooks;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    // Define the removeBook resolver to remove a book from the user's account
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedBooks;
      }
    },
  },
};

module.exports = resolvers;