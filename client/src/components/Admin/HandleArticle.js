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
  GET_COUNTRIES,
  ADD_COUNTRY,
  DELETE_COUNTRY,
  ADD_COUNTRY_DESCRIPTION
} from "../../queries";

const removeCountryDialog = {
  title: "Remove Country",
  description:
    "Are you sure you want to delete this country? All articles associated with this country will be permanently deleted",
  error: "Sorry, deleting your country did not work...",
  success: "Great, your country is now removed!"
};

const addCountryDialog = {
  title: "Add Country",
  description: "Are you sure you want to add a country?",
  error: "Sorry, adding your country did not work...",
  success: "Great, your country is now added!"
};

class HandleArticle extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false,
    openDialog: false,
    openForm: false,
    countryDescription: "",
    countrySelected: "",
    country: "",
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
    this.setState({ openForm: true, countrySelected: _id }, () => {
      this.setState({ expanded: 0 });
    });
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

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
      country,
      countryDescription,
      countrySelected
    } = this.state;
    return (
      <Query query={GET_COUNTRIES}>
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
                mutation={ADD_COUNTRY_DESCRIPTION}
                variables={{
                  _id: countrySelected,
                  description: countryDescription
                }}
                update={(cache, { data }) => {
                  const countries = cache.readQuery({
                    query: GET_COUNTRIES
                  }).getCountries;
                  cache.writeQuery({
                    query: GET_COUNTRIES,
                    data: {
                      getCountries: countries
                    }
                  });
                }}
              >
                {(addCountryDescription, { loading, error }) => (
                  <Dialog
                    open={this.state.openForm}
                    onClose={this.handleCloseForm}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Add a country description
                    </DialogTitle>
                    <DialogContent>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Description"
                        multiline
                        name="countryDescription"
                        value={this.state.countryDescription}
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
                          addCountryDescription();
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
              {data.getCountries.map(({ _id, country, description }) => {
                return (
                  <div key={_id} className="HandleArticle__Section">
                    <Mutation
                      mutation={DELETE_COUNTRY}
                      variables={{ _id, country }}
                      update={(cache, { data }) => {
                        const countries = cache.readQuery({
                          query: GET_COUNTRIES
                        }).getCountries;
                        cache.writeQuery({
                          query: GET_COUNTRIES,
                          data: {
                            getCountries: countries
                              .map(
                                country =>
                                  country._id !== data.deleteCountry._id &&
                                  country
                              )
                              .filter(country => country !== false)
                          }
                        });
                      }}
                    >
                      {(deleteCountry, { loading, error }) => (
                        <div>
                          <form className="HandleArticle__AddCountry">
                            <IconButton
                              className="HandleArticle__Section__Icon"
                              aria-label="Delete"
                              onClick={() =>
                                this.handleAction(
                                  deleteCountry,
                                  removeCountryDialog
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
                      expanded={expanded === country}
                      onChange={this.handleChange(country)}
                    >
                      <ExpansionPanelSummary
                        className="HandleArticle__Section__Country__Header"
                        expandIcon={<ExpandMoreIcon />}
                      >
                        <Typography
                          component="h1"
                          className="HandleArticle__Section__Country__Header__Title"
                        >
                          {country}
                        </Typography>
                        {description && (
                          <Typography
                            className="HandleArticle__Section__Country__Header__Description"
                            component="p"
                          >
                            {description}
                          </Typography>
                        )}
                        <Button
                          className="HandleArticle__Section__Country__Header__AddDescription"
                          onClick={event =>
                            this.handleClickOpenForm(event, _id)
                          }
                        >
                          {description
                            ? "Modify description"
                            : "Add description"}
                        </Button>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails className="HandleArticle__Section__Country__Content">
                        <RemoveArticle country={country} />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                );
              })}
              <Mutation
                mutation={ADD_COUNTRY}
                variables={{ country: country }}
                update={(cache, { data }) => {
                  const countries = cache.readQuery({
                    query: GET_COUNTRIES
                  }).getCountries;
                  cache.writeQuery({
                    query: GET_COUNTRIES,
                    data: {
                      getCountries: countries.concat([data.addCountry])
                    }
                  });
                }}
              >
                {(addCountry, { loading, error }) => (
                  <div>
                    <form className="HandleArticle__AddCountry">
                      <TextField
                        required
                        id="country"
                        name="country"
                        value={country}
                        variant="outlined"
                        label="Country"
                        className="HandleArticle__AddCountry__Input"
                        onChange={event => this.handleFormChange(event)}
                        margin="normal"
                      />
                      <Button
                        className="HandleArticle__AddCountry__Button"
                        variant="outlined"
                        onClick={() =>
                          this.handleAction(addCountry, addCountryDialog)
                        }
                      >
                        {loading ? "Loading..." : "Add a country"}
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
