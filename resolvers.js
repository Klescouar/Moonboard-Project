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

const uploadDir = "./client/src/assets/images";
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
    getArticles: async (root, args, { Article, Chapter }) => {
      const allChapters = await Chapter.find().sort({ createdDate: "desc" });
      const allArticles = await Article.find().sort({ createdDate: "desc" });
      return allChapters
        .map(chapter => {
          const chapterUpdated = {};
          chapterUpdated.chapter = chapter;
          chapterUpdated.articles = allArticles.filter(
            article => article.chapter === chapter.number
          );
          return chapterUpdated;
        })
        .sort((a, b) => a.chapter.number - b.chapter.number);
    },
    getArticlesByChapter: async (root, { chapter }, { Article }) => {
      const articlesByChapter = await Article.find({ chapter: chapter }).sort({
        createdDate: "desc"
      });
      return articlesByChapter;
    },
    getChapters: async (root, args, { Chapter }) => {
      const allChapters = await Chapter.find().sort({ createdDate: "desc" });
      return allChapters;
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
      { description, image, link, place, chapter, time, date },
      { Article }
    ) => {
      const newArticle = await new Article({
        description,
        image,
        link,
        chapter,
        date,
        place,
        time
      }).save();
    },
    addChapter: async (root, { number }, { Chapter }) => {
      const newChapter = await new Chapter({
        number
      }).save();
      return newChapter;
    },
    addChapterDescription: async (root, { _id, description }, { Chapter }) => {
      const chapterUpdate = await Chapter.findById({ _id });
      chapterUpdate.description = description;
      const chapterUpdated = await chapterUpdate.save();
      return chapterUpdated;
    },
    deleteChapter: async (root, { _id, number }, { Chapter, Article }) => {
      const chapter = await Chapter.findOneAndRemove({ _id });
      const article = await Article.remove({ chapter: number });
      return chapter;
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
