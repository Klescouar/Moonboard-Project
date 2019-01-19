import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import { ADD_ARTICLE } from "../../queries";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import UploadImage from "./UlploadImage";
import SnackBarSuccess from "../SnackBar/SnackBarSuccess";
import SnackBarError from "../SnackBar/SnackBarError";

const addArticleDialog = {
  error: "Sorry, creating your article did not work...",
  success: "Great, your article is now created!"
};

const initialState = {
  description: "",
  image: "",
  time: "",
  date: "",
  link: "",
  place: "",
  country: null,
  openErrorSnackBar: false,
  openSuccessSnackBar: false
};

class AddArticle extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState, ...props.match.params };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  getFileName = fileName => {
    this.setState({
      image: fileName
    });
  };

  handleSubmit = (event, addArticle) => {
    event.preventDefault();
    addArticle()
      .then(res => {
        this.setState({
          ...initialState,
          openSuccessSnackBar: true
        });
        setTimeout(() => {
          this.setState({
            openSuccessSnackBar: false
          });
        }, 3000);
        this.props.history.push("/admin/backoffice");
      })
      .catch(err => {
        this.setState({
          openErrorSnackBar: true
        });
        setTimeout(() => {
          this.setState({
            openErrorSnackBar: false
          });
        }, 3000);
      });
  };

  validateForm = () => {
    const { description, image, link, date, place, time } = this.state;
    const isInvalid =
      !description || !link || !image || !date || !time || !place;
    return isInvalid;
  };

  render() {
    const {
      description,
      image,
      link,
      country,
      time,
      place,
      date,
      openSuccessSnackBar,
      openErrorSnackBar
    } = this.state;

    return (
      <Mutation
        mutation={ADD_ARTICLE}
        variables={{
          description,
          image,
          link,
          time,
          date,
          place,
          country,
          creationDate: Date.now().toString()
        }}
      >
        {(addArticle, { data, loading, error }) => {
          return (
            <Card className="AddArticle">
              <SnackBarSuccess
                text={addArticleDialog.success}
                open={openSuccessSnackBar}
              />
              <SnackBarError
                text={addArticleDialog.error}
                open={openErrorSnackBar}
              />
              <form
                className="AddArticle__Form"
                onSubmit={event => this.handleSubmit(event, addArticle)}
              >
                <p className="AddArticle__Form__Title">ADD AN ARTICLE</p>
                <TextField
                  id="time"
                  label="Time"
                  type="time"
                  name="time"
                  defaultValue="00:00"
                  onChange={event => this.handleChange(event)}
                  className="AddArticle__Form__Input"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  id="date"
                  label="Date"
                  type="date"
                  name="date"
                  className="AddArticle__Form__Input"
                  defaultValue={date}
                  onChange={event => this.handleChange(event)}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  required
                  id="place"
                  name="place"
                  value={place}
                  variant="outlined"
                  label="Place"
                  className="AddArticle__Form__Input"
                  onChange={event => this.handleChange(event)}
                  margin="normal"
                />
                <UploadImage
                  name="image"
                  fileName={image}
                  getFileName={this.getFileName}
                />
                <TextField
                  required
                  id="standard-name"
                  name="description"
                  value={description}
                  label="Article's description"
                  variant="outlined"
                  multiline
                  rows="4"
                  className="AddArticle__Form__Input"
                  onChange={event => this.handleChange(event)}
                  margin="normal"
                />
                <TextField
                  required
                  id="standard-name"
                  name="link"
                  value={link}
                  variant="outlined"
                  label="Soundcloud link"
                  className="AddArticle__Form__Input"
                  onChange={event => this.handleChange(event)}
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={this.validateForm()}
                  className="AddArticle__Form__Submit"
                >
                  Send new article
                </Button>
              </form>
            </Card>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(AddArticle);
