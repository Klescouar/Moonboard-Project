const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createWriteStream } = require('fs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
const GraphQLUpload = require('apollo-upload-server');
const Article = require('./models/Article');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

const uploadDir = './client/src/assets/images';
// Ensure upload directory exists
mkdirp.sync(uploadDir);

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, path }))
  );
};

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, path } = await storeFS({ stream, filename });
  return { id, filename, mimetype, encoding, path };
};

exports.resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getArticles: async (root, args) => {
      const allArticles = await Article.find().sort({ createdDate: 'desc' });
      return allArticles;
    }
  },
  Mutation: {
    singleUpload: (obj, { file }) => processUpload(file),
    addArticle: async (root, { title, image, link }) => {
      const newArticle = await new Article({
        title,
        image,
        link
      }).save();
      return newArticle;
    },
    deleteArticle: async (root, { _id }) => {
      const article = await Article.findOneAndRemove({ _id });
      return article;
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '1hr') };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    }
  }
};
