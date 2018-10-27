import React, { Component, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SnackBarSuccess from '../SnackBar/SnackBarSuccess';
import SnackBarError from '../SnackBar/SnackBarError';

class DialogPopin extends Component {
  state = {
    openSuccessSnackBar: false,
    openErrorSnackBar: false
  };

  componentDidmount() {
    if (!this.props.withDialog)
      this.props
        .action()
        .then(res => {
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
        .catch(err => {
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
  }

  render() {
    const {
      fullScreen,
      withDialog,
      handleClose,
      openDialog,
      dialog: { title, description, error, success },
      action
    } = this.props;
    const { openErrorSnackBar, openSuccessSnackBar } = this.state;

    return (
      <Fragment>
        <SnackBarSuccess text={success} open={openSuccessSnackBar} />
        <SnackBarError text={error} open={openErrorSnackBar} />
        {withDialog && (
          <Dialog
            className="RemoveArticle__Dialog"
            fullScreen={fullScreen}
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              className="RemoveArticle__Dialog__Title"
              id="responsive-dialog-title"
            >
              {title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  action()
                    .then(res => {
                      handleClose();
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
                    .catch(err => {
                      this.setState({
                        openErrorSnackBar: true,
                        openDialog: false
                      });
                      setTimeout(() => {
                        this.setState({
                          openErrorSnackBar: false
                        });
                      }, 3000);
                    })
                }
                color="primary"
              >
                Yes
              </Button>
              <Button onClick={handleClose} color="primary" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Fragment>
    );
  }
}

export default DialogPopin;
