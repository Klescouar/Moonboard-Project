import gql from 'graphql-tag';

export const articleFragments = {
  article: gql`
    fragment CompleteArticle on Article {
      title
      image
      link
      date
      time
      chapter
    }
  `
};

export const chapterFragments = {
  chapter: gql`
    fragment CompleteChapter on Chapter {
      _id
      number
    }
  `
};
