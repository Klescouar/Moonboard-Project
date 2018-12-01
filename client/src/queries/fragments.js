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
      chapter
    }
  `
};

export const chapterFragments = {
  chapter: gql`
    fragment CompleteChapter on Chapter {
      _id
      number
      description
    }
  `
};
