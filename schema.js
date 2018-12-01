exports.typeDefs = `
  type Article {
    _id: ID!
    description: String
    image: String!
    link: String!
    chapter: Int!
    date: String!
    time: String!
    place: String!
  }

  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Chapter {
    _id: ID!
    number: Int!
    description: String
  }

  type User {
    _id: ID
    username: String!
    password: String!
    email: String!
    joinDate: String
  }

  type ChapterAndArticleUnion {
    chapter: Chapter,
    articles: [Article]
  }

  type Query {
    getArticles: [ChapterAndArticleUnion]
    getArticlesByChapter(chapter: Int!): [Article]
    getChapters: [Chapter]
    getArticle(_id: ID!): Article
    getCurrentUser: User
  }

  type Token {
    token: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    addChapterDescription(_id: ID, description: String!): Chapter
    addArticle(description: String!, image: String!, link: String!, chapter: Int!, time: String!, date: String!): Article
    addChapter(number: Int!): Chapter
    deleteChapter(_id: ID, number: Int!): Chapter
    deleteArticle(_id: ID): Article
    signinUser(username: String!, password: String!): Token
    signupUser(username: String!, email: String!, password: String!): Token
  }
`;
