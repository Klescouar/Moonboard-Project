import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import windowSize from 'react-window-size';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HandleArticle from './HandleArticle';
import AddArticle from './AddArticle';
import withAuth from '../withAuth';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    overflow: 'auto'
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  }
});

class Dashboard extends React.Component {
  state = {
    open: this.props.windowWidth < 600 ? false : true
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Router>
        <Fragment>
          <CssBaseline />
          <div className={`Admin ${classes.root}`}>
            <AppBar position="absolute">
              <Toolbar
                disableGutters={!this.state.open}
                className={classes.toolbar}
              >
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(
                    classes.menuButton,
                    this.state.open && classes.menuButtonHidden,
                    'Admin__NavBar'
                  )}
                >
                  <MenuIcon />
                </IconButton>
                {this.props.windowWidth > 600 && (
                  <Typography
                    variant="title"
                    color="inherit"
                    noWrap
                    className={classes.title}
                  >
                    MoonBoard Back Office
                  </Typography>
                )}
              </Toolbar>
            </AppBar>
            <main className={`Admin__Content ${classes.content}`}>
              <Fragment>
                <Route
                  path="/admin/backoffice/"
                  exact
                  component={HandleArticle}
                />
                <Route
                  path="/admin/backoffice/addArticle/country/:country"
                  component={AddArticle}
                />
              </Fragment>
            </main>
          </div>
        </Fragment>
      </Router>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withAuth(session => session && session.getCurrentUser)(
  withStyles(styles)(windowSize(Dashboard))
);
