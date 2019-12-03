const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createWriteStream } = require("fs");
const fs = require("fs");
const mkdirp = require("mkdirp");
const shortid = require("shortid");
const GraphQLUpload = require("apollo-upload-server");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

const uploadDir = "./media";
// Ensure upload directory exists
mkdirp.sync(uploadDir);

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", error => reject(error))
      .on("finish", () => resolve({ id, path }))
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
    getArticles: async (root, args, { Article, Country }) => {
      const allCountries = await Country.find().sort({ createdDate: "desc" });
      const allArticles = await Article.find().sort({ createdDate: "desc" });
      return allCountries
        .map(country => {
          const countryUpdated = {};
          countryUpdated.country = country;
          countryUpdated.articles = allArticles
            .filter(article => article.country === country.country)
            .sort((a, b) => {
              return Number(a.creationDate) - Number(b.creationDate);
            });
          return countryUpdated;
        })
        .sort((a, b) => {
          return (
            Number(a.country.creationDate) - Number(b.country.creationDate)
          );
        });
    },
    getArticlesByCountry: async (root, { country }, { Article }) => {
      const articlesByCountry = await Article.find({ country: country }).sort({
        createdDate: "desc"
      });
      return articlesByCountry;
    },
    getCountries: async (root, args, { Country }) => {
      const allCountries = await Country.find().sort({ createdDate: "desc" });
      return allCountries;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      });
      return user;
    }
  },
  Mutation: {
    singleUpload: (obj, { file }) => processUpload(file),
    addArticle: async (
      root,
      { description, image, link, place, country, time, date, creationDate },
      { Article }
    ) => {
      const newArticle = await new Article({
        description,
        image,
        link,
        country,
        date,
        place,
        time,
        creationDate
      }).save();
    },
    addCountry: async (root, { country, creationDate }, { Country }) => {
      const newCountry = await new Country({
        country,
        creationDate
      }).save();
      return newCountry;
    },
    addCountryDescription: async (root, { _id, description }, { Country }) => {
      const countryUpdate = await Country.findById({ _id });
      countryUpdate.description = description;
      const countryUpdated = await countryUpdate.save();
      return countryUpdated;
    },
    deleteCountry: async (root, { _id, country }, { Country, Article }) => {
      const countryRemoved = await Country.findOneAndRemove({ _id });
      const article = await Article.remove({ country: country });
      return countryRemoved;
    },
    deleteArticle: async (root, { _id }, { Article }) => {
      const article = await Article.findOneAndRemove({ _id });
      return article;
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
