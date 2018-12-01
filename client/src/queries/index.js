import gql from "graphql-tag";
import { articleFragments, chapterFragments } from "./fragments";

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
    $chapter: Int!
    $time: String!
    $date: String!
    $place: String!
  ) {
    addArticle(
      description: $description
      image: $image
      link: $link
      chapter: $chapter
      time: $time
      date: $date
      place: $place
    ) {
      ...CompleteArticle
    }
  }
  ${articleFragments.article}
`;

export const ADD_CHAPTER = gql`
  mutation($number: Int!) {
    addChapter(number: $number) {
      ...CompleteChapter
    }
  }
  ${chapterFragments.chapter}
`;

export const ADD_CHAPTER_DESCRIPTION = gql`
  mutation($_id: ID, $description: String!) {
    addChapterDescription(_id: $_id, description: $description) {
      ...CompleteChapter
    }
  }
  ${chapterFragments.chapter}
`;

export const GET_ARTICLES = gql`
  query {
    getArticles {
      chapter {
        _id
        number
        description
      }
      articles {
        _id
        description
        image
        link
        chapter
        date
        place
        time
      }
    }
  }
`;

export const GET_ARTICLES_BY_CHAPTER = gql`
  query($chapter: Int!) {
    getArticlesByChapter(chapter: $chapter) {
      _id
      description
      image
      link
      chapter
      date
      place
      time
    }
  }
`;

export const GET_CHAPTERS = gql`
  query {
    getChapters {
      _id
      number
      description
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

export const DELETE_CHAPTER = gql`
  mutation($_id: ID!, $number: Int!) {
    deleteChapter(_id: $_id, number: $number) {
      _id
      number
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
