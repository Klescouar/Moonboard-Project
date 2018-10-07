import React from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

export const mainListItems = (
  <div className="ListItems">
    <NavLink to="/admin/backoffice/addArticle" className="ListItems__Link">
      <ListItem button>
        <ListItemIcon>
          <AddPhotoAlternateIcon />
        </ListItemIcon>
        <ListItemText primary="Upload an article" />
      </ListItem>
    </NavLink>
    <NavLink to="/admin/backoffice/removeArticle" className="ListItems__Link">
      <ListItem button>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary="Remove an article" />
      </ListItem>
    </NavLink>
  </div>
);
