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
