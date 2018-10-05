import gql from 'graphql-tag';

export const articleFragments = {
  article: gql`
    fragment CompleteArticle on Article {
      title
      image
      link
    }
  `
};
