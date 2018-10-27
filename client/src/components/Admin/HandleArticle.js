import React, { Component } from 'react';
import RemoveArticle from './RemoveArticle';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogPopin from '../Dialog/Dialog';

import { Query, Mutation } from 'react-apollo';
import { GET_CHAPTERS, ADD_CHAPTER, DELETE_CHAPTER } from '../../queries';

const removeChapterDialog = {
  title: 'Remove Chapter',
  description:
    'Are you sure you want to delete this chapter? All articles associated with this chapter will be permanently deleted',
  error: 'Sorry, deleting your chapter did not work...',
  success: 'Great, your chapter is now removed!'
};

const addChapterDialog = {
  title: 'Add Chapter',
  description: 'Are you sure you want to add a chapter?',
  error: 'Sorry, adding your chapter did not work...',
  success: 'Great, your chapter is now added!'
};

class HandleArticle extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false,
    openDialog: false,
    action: () => {},
    expanded: 1,
    dialog: {
      title: '',
      description: '',
      success: '',
      error: ''
    }
  };

  handleClose = deleteArticle => {
    this.setState({ openDialog: false });
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
    const { openDialog, action, dialog } = this.state;
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
              {data.getChapters
                .sort((a, b) => a.number > b.number)
                .map(({ _id, number }) => {
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
                          <Typography component="h1">
                            Chapitre {number}
                          </Typography>
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
                        {loading ? 'Loading...' : 'Add a chapter'}
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
