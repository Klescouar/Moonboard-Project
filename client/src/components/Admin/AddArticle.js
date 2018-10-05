import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { ADD_ARTICLE } from '../../queries';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import UploadImage from './UlploadImage';

class AddArticle extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { title: '', image: 'azdza', link: '' };
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
    addArticle();
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
            <div className="AddArticle">
              <h1 className="AddArticle__Title">Add an article</h1>
              <form
                className="AddArticle__Form"
                onSubmit={event => this.handleSubmit(event, addArticle)}
              >
                <TextField
                  id="standard-name"
                  name="title"
                  label="Title de l'article"
                  className="AddArticle__Form__Title__Input"
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
                  id="standard-name"
                  name="link"
                  label="Lien Soundcloud"
                  className="AddArticle__Form__Input"
                  value={link}
                  onChange={this.handleChange('link')}
                  margin="normal"
                />
                <Button
                  type="submit"
                  onClick={this.submit}
                  variant="outlined"
                  className="AddArticle__Form__Submit"
                >
                  Envoyer
                </Button>
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(AddArticle);
