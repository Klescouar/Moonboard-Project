import gql from "graphql-tag";

export const articleFragments = {
  article: gql`
    fragment CompleteArticle on Article {
      description
      image
      link
      date
      place
      time
      country
    }
  `
};

export const countryFragments = {
  country: gql`
    fragment CompleteCountry on Country {
      _id
      country
      description
    }
  `
};
