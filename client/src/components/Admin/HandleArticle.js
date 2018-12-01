import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import Button from "@material-ui/core/Button";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogPopin from "../Dialog/Dialog";
import RemoveArticle from "./RemoveArticle";

import {
  GET_CHAPTERS,
  ADD_CHAPTER,
  DELETE_CHAPTER,
  ADD_CHAPTER_DESCRIPTION
} from "../../queries";

const removeChapterDialog = {
  title: "Remove Chapter",
  description:
    "Are you sure you want to delete this chapter? All articles associated with this chapter will be permanently deleted",
  error: "Sorry, deleting your chapter did not work...",
  success: "Great, your chapter is now removed!"
};

const addChapterDialog = {
  title: "Add Chapter",
  description: "Are you sure you want to add a chapter?",
  error: "Sorry, adding your chapter did not work...",
  success: "Great, your chapter is now added!"
};

class HandleArticle extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false,
    openDialog: false,
    openForm: false,
    chapterDescription: "",
    chapterSelected: "",
    action: () => {},
    expanded: 1,
    dialog: {
      title: "",
      description: "",
      success: "",
      error: ""
    }
  };

  handleClose = deleteArticle => {
    this.setState({ openDialog: false });
  };

  handleCloseForm = () => {
    this.setState({
      openForm: false
    });
  };

  handleFormChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClickOpenForm = (event, _id) => {
    event.preventDefault();
    this.setState({ openForm: true, chapterSelected: _id }, () => {
      this.setState({ expanded: 0 });
    });
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  handleAction = (action, dialog) => {
    this.setState({
      openDialog: true,
      action: action,
      dialog: dialog
    });
  };

  render() {
    const { expanded } = this.state;
    const {
      openDialog,
      action,
      dialog,
      chapterDescription,
      chapterSelected
    } = this.state;
    return (
      <Query query={GET_CHAPTERS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div className="HandleArticle">
              <DialogPopin
                withDialog
                openDialog={openDialog}
                handleClose={this.handleClose}
                action={action}
                dialog={dialog}
              />
              <Mutation
                mutation={ADD_CHAPTER_DESCRIPTION}
                variables={{
                  _id: chapterSelected,
                  description: chapterDescription
                }}
                update={(cache, { data }) => {
                  const chapters = cache.readQuery({
                    query: GET_CHAPTERS
                  }).getChapters;
                  cache.writeQuery({
                    query: GET_CHAPTERS,
                    data: {
                      getChapters: chapters
                    }
                  });
                }}
              >
                {(addChapterDescription, { loading, error }) => (
                  <Dialog
                    open={this.state.openForm}
                    onClose={this.handleCloseForm}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Add a chapter description
                    </DialogTitle>
                    <DialogContent>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Description"
                        multiline
                        name="chapterDescription"
                        value={this.state.chapterDescription}
                        onChange={this.handleFormChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => this.setState({ openForm: false })}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          addChapterDescription();
                          this.setState({ openForm: false });
                        }}
                        color="primary"
                      >
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Mutation>
              {data.getChapters
                .sort((a, b) => a.number > b.number)
                .map(({ _id, number, description }) => {
                  return (
                    <div key={_id} className="HandleArticle__Section">
                      <Mutation
                        mutation={DELETE_CHAPTER}
                        variables={{ _id, number }}
                        update={(cache, { data }) => {
                          const chapters = cache.readQuery({
                            query: GET_CHAPTERS
                          }).getChapters;
                          cache.writeQuery({
                            query: GET_CHAPTERS,
                            data: {
                              getChapters: chapters
                                .map(
                                  chapter =>
                                    chapter._id !== data.deleteChapter._id &&
                                    chapter
                                )
                                .filter(chapter => chapter !== false)
                            }
                          });
                        }}
                      >
                        {(deleteChapter, { loading, error }) => (
                          <div>
                            <form className="HandleArticle__AddChapter">
                              <IconButton
                                className="HandleArticle__Section__Icon"
                                aria-label="Delete"
                                onClick={() =>
                                  this.handleAction(
                                    deleteChapter,
                                    removeChapterDialog
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </form>
                            {error && <p>Error :( Please try again</p>}
                          </div>
                        )}
                      </Mutation>
                      <ExpansionPanel
                        expanded={expanded === number}
                        onChange={this.handleChange(number)}
                      >
                        <ExpansionPanelSummary
                          className="HandleArticle__Section__Chapter__Header"
                          expandIcon={<ExpandMoreIcon />}
                        >
                          <Typography
                            component="h1"
                            className="HandleArticle__Section__Chapter__Header__Title"
                          >
                            Chapitre {number}
                          </Typography>
                          {description && (
                            <Typography
                              className="HandleArticle__Section__Chapter__Header__Description"
                              component="p"
                            >
                              {description}
                            </Typography>
                          )}
                          <Button
                            className="HandleArticle__Section__Chapter__Header__AddDescription"
                            onClick={event =>
                              this.handleClickOpenForm(event, _id)
                            }
                          >
                            {description
                              ? "Modify description"
                              : "Add description"}
                          </Button>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="HandleArticle__Section__Chapter__Content">
                          <RemoveArticle chapter={number} />
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                  );
                })}
              <Mutation
                mutation={ADD_CHAPTER}
                variables={{ number: data.getChapters.length + 1 }}
                update={(cache, { data }) => {
                  const chapters = cache.readQuery({
                    query: GET_CHAPTERS
                  }).getChapters;
                  cache.writeQuery({
                    query: GET_CHAPTERS,
                    data: {
                      getChapters: chapters.concat([data.addChapter])
                    }
                  });
                }}
              >
                {(addChapter, { loading, error }) => (
                  <div>
                    <form className="HandleArticle__AddChapter">
                      <Button
                        className="HandleArticle__AddChapter__Button"
                        variant="outlined"
                        onClick={() =>
                          this.handleAction(addChapter, addChapterDialog)
                        }
                      >
                        {loading ? "Loading..." : "Add a chapter"}
                      </Button>
                    </form>
                    {error && <p>Error :( Please try again</p>}
                  </div>
                )}
              </Mutation>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withMobileDialog()(HandleArticle);
