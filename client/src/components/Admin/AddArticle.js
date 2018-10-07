import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { ADD_ARTICLE } from '../../queries';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import SnackBarSuccess from '../SnackBar/SnackBarSuccess';
import SnackBarError from '../SnackBar/SnackBarError';
import UploadImage from './UlploadImage';

const ERROR_TEXT = 'Sorry, creating your article did not work...';
const SUCCESS_TEXT = 'Great, your article is now created!';

const initialState = {
  title: '',
  image: '',
  link: '',
  openErrorSnackBar: false,
  openSuccessSnackBar: false
};

class AddArticle extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { ...initialState };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  getFileName = fileName => {
    this.setState({
      image: fileName
    });
  };

  handleSubmit = (event, addArticle) => {
    event.preventDefault();
    addArticle()
      .then(() => {
        this.setState({ ...initialState });
        this.setState({
          openSuccessSnackBar: true
        });
        setTimeout(() => {
          this.setState({
            openSuccessSnackBar: false
          });
        }, 3000);
      })
      .catch(() => {
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
    const { title, image, link } = this.state;
    const isInvalid = !title || !link || !image;
    return isInvalid;
  };

  render() {
    const { title, image, link } = this.state;

    return (
      <Mutation
        mutation={ADD_ARTICLE}
        variables={{
          title,
          image,
          link
        }}
      >
        {(addArticle, { data, loading, error }) => {
          return (
            <Card className="AddArticle">
              <SnackBarSuccess
                text={SUCCESS_TEXT}
                open={this.state.openSuccessSnackBar}
              />
              <SnackBarError
                text={ERROR_TEXT}
                open={this.state.openErrorSnackBar}
              />
              <form
                className="AddArticle__Form"
                onSubmit={event => this.handleSubmit(event, addArticle)}
              >
                <p className="AddArticle__Form__Title">ADD AN ARTICLE</p>
                <TextField
                  required
                  id="standard-name"
                  name="title"
                  label="Article's title"
                  className="AddArticle__Form__Input"
                  value={title}
                  onChange={this.handleChange('title')}
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
                  name="link"
                  label="Soundcloud link"
                  className="AddArticle__Form__Input"
                  value={link}
                  onChange={this.handleChange('link')}
                  margin="normal"
                />
                <Button
                  type="submit"
                  onClick={this.submit}
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
