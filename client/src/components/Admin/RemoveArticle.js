import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import AddIcon from "@material-ui/icons/Add";
import ArticleCard from "./ArticleCard";
import DialogPopin from "../Dialog/Dialog";

import { DELETE_ARTICLE, GET_ARTICLES_BY_COUNTRY } from "../../queries";

const removeArticleDialog = {
  title: "Remove Article",
  description: "Are you sure you want to delete this article?",
  error: "Sorry, deleting your article did not work...",
  success: "Great, your article is now removed!"
};

class RemoveArticle extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false,
    openDialog: false,
    dialog: {
      title: "",
      description: "",
      success: "",
      error: ""
    },
    action: () => {}
  };

  handleClose = deleteArticle => {
    this.setState({ openDialog: false });
  };

  handleAction = (action, dialog) => {
    this.setState({
      openDialog: true,
      action: action,
      dialog: dialog
    });
  };

  render() {
    const { country } = this.props;
    const { openDialog, action, dialog } = this.state;
    return (
      <Query query={GET_ARTICLES_BY_COUNTRY} variables={{ country }}>
        {({ data, loading, error }) => {
          if (loading)
            return <CircularProgress className="Spinner" size={50} />;
          if (error) return <div>Error</div>;
          return (
            <div className="RemoveArticle">
              <DialogPopin
                withDialog
                dialog={dialog}
                openDialog={openDialog}
                handleClose={this.handleClose}
                action={action}
              />
              <div className="RemoveArticle__Articles">
                {data.getArticlesByCountry.map(article => (
                  <div
                    className="RemoveArticle__Articles__Article"
                    key={article._id}
                  >
                    <Mutation
                      mutation={DELETE_ARTICLE}
                      variables={{ _id: article._id }}
                      update={(cache, { data }) => {
                        const articlesByCountry = cache.readQuery({
                          query: GET_ARTICLES_BY_COUNTRY,
                          variables: { country }
                        }).getArticlesByCountry;
                        cache.writeQuery({
                          query: GET_ARTICLES_BY_COUNTRY,
                          variables: { country },
                          data: {
                            getArticlesByCountry: articlesByCountry
                              .map(
                                article =>
                                  article._id !== data.deleteArticle._id &&
                                  article
                              )
                              .filter(article => article !== false)
                          }
                        });
                      }}
                    >
                      {(deleteArticle, attrs = {}) => {
                        return (
                          <ArticleCard
                            deleteArticle={deleteArticle}
                            removeArticleDialog={removeArticleDialog}
                            attrs={attrs}
                            article={article}
                            handleAction={this.handleAction}
                          />
                        );
                      }}
                    </Mutation>
                  </div>
                ))}
                <NavLink
                  className="HandleArticle__Country__AddArticle"
                  to={`/admin/backoffice/addArticle/country/${country}`}
                >
                  <Typography
                    className="HandleArticle__Country__AddArticle__Title"
                    component="h1"
                  >
                    ADD AN ARTICLE
                  </Typography>
                  <Button
                    className="HandleArticle__Country__AddArticle__Icon"
                    variant="contained"
                    color="primary"
                    aria-label="Add"
                  >
                    <AddIcon />
                  </Button>
                </NavLink>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withMobileDialog()(RemoveArticle);
