import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/core/styles';
import SnackBarSuccess from '../SnackBar/SnackBarSuccess';
import SnackBarError from '../SnackBar/SnackBarError';

const ERROR_TEXT = 'Sorry, adding your pic did not work...';
const SUCCESS_TEXT = 'Great, your pic is now added!';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});

class UploadImage extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false
  };

  onDrop = async ([file]) => {
    const response = await this.props
      .mutate({
        variables: { file }
      })
      .then(() => {
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
    this.props.getFileName(file.name);
    return response;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="UploadImage">
        <SnackBarSuccess
          text={SUCCESS_TEXT}
          open={this.state.openSuccessSnackBar}
        />
        <SnackBarError text={ERROR_TEXT} open={this.state.openErrorSnackBar} />
        <p className="UploadImage__Title">Choose a pic</p>
        <input
          accept="image/*"
          className={classes.input}
          id="flat-button-file"
          onChange={e => this.onDrop(e.target.files)}
          multiple
          type="file"
        />
        <label htmlFor="flat-button-file">
          <Button
            variant="contained"
            color="default"
            component="span"
            className="UploadImage__Upload"
          >
            Upload
            <CloudUploadIcon />
          </Button>
        </label>
      </div>
    );
  }
}

export default graphql(gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      path
      filename
      mimetype
      encoding
    }
  }
`)(withStyles(styles)(UploadImage));
