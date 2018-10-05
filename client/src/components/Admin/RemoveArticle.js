import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Query, Mutation } from 'react-apollo';
import { DELETE_ARTICLE, GET_ARTICLES } from '../../queries';

const handleDelete = deleteArticle => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this article?'
  );
  if (confirmDelete) {
    deleteArticle().then(({ data }) => {
      console.log(data);
    });
  }
};

const RemoveArticle = ({ username }) => (
  <Query query={GET_ARTICLES} variables={{ username }}>
    {({ data, loading, error }) => {
      console.log(error);
      if (loading) return <div>LOADING...</div>;
      if (error) return <div>Error</div>;
      return (
        <ul className="RemoveArticle">
          <h1 className="RemoveArticle__Title"> Remove an article</h1>
          {!data.getArticles.length && (
            <p>
              <strong>You have not added any articles yet</strong>
            </p>
          )}
          <div className="RemoveArticle__Articles">
            {data.getArticles.map(article => (
              <div
                className="RemoveArticle__Articles__Article"
                key={article._id}
              >
                <Mutation
                  mutation={DELETE_ARTICLE}
                  variables={{ _id: article._id }}
                  refetchQueries={() => [{ query: GET_ARTICLES }]}
                  update={(cache, { data: { deleteArticle } }) => {
                    const { getArticles } = cache.readQuery({
                      query: GET_ARTICLES,
                      variables: { username }
                    });

                    cache.writeQuery({
                      query: GET_ARTICLES,
                      variables: { username },
                      data: {
                        getArticles: getArticles.filter(
                          article => article._id !== deleteArticle._id
                        )
                      }
                    });
                  }}
                >
                  {(deleteArticle, attrs = {}) => (
                    <Card className="RemoveArticle__Articles__Article__Card">
                      <CardMedia
                        className="RemoveArticle__Articles__Article__Card__Image"
                        image={'../../assets/images/Islande.jpg'}
                        title="Contemplative Reptile"
                      />
                      <CardContent className="RemoveArticle__Articles__Article__Card__Content">
                        <Typography
                          gutterBottom
                          variant="headline"
                          component="h2"
                          className="RemoveArticle__Articles__Article__Card__Content__Title"
                        >
                          {article.title}
                        </Typography>
                        <Typography component="p">
                          {article.description}
                        </Typography>
                      </CardContent>
                      <CardActions className="RemoveArticle__Articles__Article__Card__Action">
                        <Button
                          size="small"
                          onClick={() => handleDelete(deleteArticle)}
                          color="primary"
                          variant="outlined"
                          className="RemoveArticle__Articles__Article__Card__Action__Button"
                        >
                          {attrs.loading ? 'deleting...' : 'DELETE'}
                        </Button>
                      </CardActions>
                    </Card>
                  )}
                </Mutation>
              </div>
            ))}
          </div>
        </ul>
      );
    }}
  </Query>
);

export default RemoveArticle;
