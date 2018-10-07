import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { ApolloConsumer } from 'react-apollo';

const handleSignout = (client, history) => {
  localStorage.setItem('token', '');
  client.resetStore();
  history.push('/');
};

const Signout = ({ history, session }) => {
  return (
    <div>
      {session && session.getCurrentUser ? (
        <ApolloConsumer>
          {client => {
            return (
              <Button
                onClick={() => handleSignout(client, history)}
                className="Logout"
                variant="extendedFab"
                aria-label="Delete"
              >
                <AccountCircleIcon className="Logout__Icon" />
                Deconnexion
              </Button>
            );
          }}
        </ApolloConsumer>
      ) : null}
    </div>
  );
};

export default withRouter(Signout);
