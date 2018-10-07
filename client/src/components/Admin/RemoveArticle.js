import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import SnackBarSuccess from '../SnackBar/SnackBarSuccess';
import SnackBarError from '../SnackBar/SnackBarError';

import { Query, Mutation } from 'react-apollo';
import { DELETE_ARTICLE, GET_ARTICLES } from '../../queries';

const ERROR_TEXT = 'Sorry, deleting your article did not work...';
const SUCCESS_TEXT = 'Great, your article is now removed!';

class RemoveArticle extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false,
    openDialog: false,
    deleteArticle: {}
  };

  handleDelete = () => {
    this.state
      .deleteArticle()
      .then(() => {
        this.setState({
          openSuccessSnackBar: true,
          openDialog: false
        });
        setTimeout(() => {
          this.setState({
            openSuccessSnackBar: false
          });
        }, 3000);
      })
      .catch(() => {
        this.setState({
          openErrorSnackBar: true,
          openDialog: false
        });
        setTimeout(() => {
          this.setState({
            openErrorSnackBar: false
          });
        }, 3000);
      });
  };

  handleClose = deleteArticle => {
    this.setState({ openDialog: false });
  };

  handleDialog = deleteArticle => {
    this.setState({
      openDialog: true,
      deleteArticle: deleteArticle
    });
  };

  render() {
    const { fullScreen } = this.props;
    return (
      <Query query={GET_ARTICLES}>
        {({ data, loading, error }) => {
          if (loading)
            return <CircularProgress className="Spinner" size={50} />;
          if (error) return <div>Error</div>;
          return (
            <div className="RemoveArticle">
              <Dialog
                className="RemoveArticle__Dialog"
                fullScreen={fullScreen}
                open={this.state.openDialog}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle
                  className="RemoveArticle__Dialog__Title"
                  id="responsive-dialog-title"
                >
                  {'Remove Article'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this article?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDelete} color="primary">
                    Yes
                  </Button>
                  <Button onClick={this.handleClose} color="primary" autoFocus>
                    No
                  </Button>
                </DialogActions>
              </Dialog>
              <SnackBarSuccess
                text={SUCCESS_TEXT}
                open={this.state.openSuccessSnackBar}
              />
              <SnackBarError
                text={ERROR_TEXT}
                open={this.state.openErrorSnackBar}
              />
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
                          query: GET_ARTICLES
                        });

                        cache.writeQuery({
                          query: GET_ARTICLES,

                          data: {
                            getArticles: getArticles.filter(
                              article => article._id !== deleteArticle._id
                            )
                          }
                        });
                      }}
                    >
                      {(deleteArticle, attrs = {}) => {
                        return (
                          <Card className="RemoveArticle__Articles__Article__Card">
                            <CardMedia
                              className="RemoveArticle__Articles__Article__Card__Image"
                              image={require(`../../assets/images/${
                                article.image
                              }`)}
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
                                onClick={() => this.handleDialog(deleteArticle)}
                                color="primary"
                                variant="outlined"
                                className="RemoveArticle__Articles__Article__Card__Action__Button"
                              >
                                {attrs.loading ? 'deleting...' : 'DELETE'}
                              </Button>
                            </CardActions>
                          </Card>
                        );
                      }}
                    </Mutation>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withMobileDialog()(RemoveArticle);
