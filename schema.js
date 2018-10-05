exports.typeDefs = `
  type Article {
    _id: ID!
    title: String!
    image: String!
    link: String!
  }

  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type User {
    _id: ID
    username: String!
    password: String!
    email: String!
    joinDate: String
    favorites: [Article]
  }

  type Query {
    getArticles: [Article]
    getArticle(_id: ID!): Article
  }

  type Token {
    token: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    addArticle(title: String!, image: String!, link: String!): Article
    deleteArticle(_id: ID): Article
    signinUser(username: String!, password: String!): Token
    signupUser(username: String!, email: String!, password: String!): Token
  }
`;
