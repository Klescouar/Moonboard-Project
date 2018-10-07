import gql from 'graphql-tag';
import { articleFragments } from './fragments';

export const UploadImageMutation = gql`
  mutation($file: Upload!) {
    uploadFile(file: $file)
  }
`;

export const ADD_ARTICLE = gql`
  mutation($title: String!, $image: String!, $link: String!) {
    addArticle(title: $title, image: $image, link: $link) {
      ...CompleteArticle
    }
  }
  ${articleFragments.article}
`;

export const GET_ARTICLES = gql`
  query {
    getArticles {
      _id
      title
      image
      link
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
