import gql from "graphql-tag";
import { articleFragments, countryFragments } from "./fragments";

export const UploadImageMutation = gql`
  mutation($file: Upload!) {
    uploadFile(file: $file)
  }
`;

export const ADD_ARTICLE = gql`
  mutation(
    $description: String!
    $image: String!
    $link: String!
    $country: String!
    $time: String!
    $date: String!
    $place: String!
    $creationDate: String!
  ) {
    addArticle(
      description: $description
      image: $image
      link: $link
      country: $country
      time: $time
      date: $date
      place: $place
      creationDate: $creationDate
    ) {
      ...CompleteArticle
    }
  }
  ${articleFragments.article}
`;

export const ADD_COUNTRY = gql`
  mutation($country: String!, $creationDate: String!) {
    addCountry(country: $country, creationDate: $creationDate) {
      ...CompleteCountry
    }
  }
  ${countryFragments.country}
`;

export const ADD_COUNTRY_DESCRIPTION = gql`
  mutation($_id: ID, $description: String!) {
    addCountryDescription(_id: $_id, description: $description) {
      ...CompleteCountry
    }
  }
  ${countryFragments.country}
`;

export const GET_ARTICLES = gql`
  query {
    getArticles {
      country {
        _id
        country
        description
        creationDate
      }
      articles {
        _id
        description
        image
        link
        country
        date
        place
        time
        creationDate
      }
    }
  }
`;

export const GET_ARTICLES_BY_COUNTRY = gql`
  query($country: String!) {
    getArticlesByCountry(country: $country) {
      _id
      description
      image
      link
      country
      date
      place
      creationDate
      time
    }
  }
`;

export const GET_COUNTRIES = gql`
  query {
    getCountries {
      _id
      country
      description
      creationDate
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation($_id: ID!) {
    deleteArticle(_id: $_id) {
      _id
    }
  }
`;

export const DELETE_COUNTRY = gql`
  mutation($_id: ID!, $country: String!) {
    deleteCountry(_id: $_id, country: $country) {
      _id
      country
    }
  }
`;

/* User Mutations */

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
