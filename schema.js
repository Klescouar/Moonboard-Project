exports.typeDefs = `
  type Article {
    _id: ID!
    description: String
    image: String!
    link: String!
    country: String!
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

  type Country {
    _id: ID!
    country: String!
    description: String
  }

  type User {
    _id: ID
    username: String!
    password: String!
    email: String!
    joinDate: String
  }

  type CountryAndArticleUnion {
    country: Country,
    articles: [Article]
  }

  type Query {
    getArticles: [CountryAndArticleUnion]
    getArticlesByCountry(country: String!): [Article]
    getCountries: [Country]
    getArticle(_id: ID!): Article
    getCurrentUser: User
  }

  type Token {
    token: String!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    addCountryDescription(_id: ID, description: String!): Country
    addArticle(description: String!, image: String!, link: String!, country: String!, time: String!, date: String!, place: String!): Article
    addCountry(country: String!): Country
    deleteCountry(_id: ID, country: String!): Country
    deleteArticle(_id: ID): Article
    signinUser(username: String!, password: String!): Token
    signupUser(username: String!, email: String!, password: String!): Token
  }
`;
