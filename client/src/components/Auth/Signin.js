import React from 'react';
import { withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { Mutation } from 'react-apollo';
import Error from '../Error';
import { SIGNIN_USER } from '../../queries';

const initialState = {
  username: '',
  password: ''
};

class Signin extends React.Component {
  state = { ...initialState };

  componentDidMount = () => {
    if (this.props.session && this.props.session.getCurrentUser)
      this.props.history.push('/admin/backoffice');
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({ data }) => {
      localStorage.setItem('token', data.signinUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push('/admin/backoffice');
    });
  };

  validateForm = () => {
    const { username, password } = this.state;
    const isInvalid = !username || !password;
    return isInvalid;
  };

  render() {
    const { username, password } = this.state;

    return (
      <div className="Signin">
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <Card className="Signin__Card">
                <form
                  className="Signin__Card__Form"
                  onSubmit={event => this.handleSubmit(event, signinUser)}
                >
                  <TextField
                    required
                    name="username"
                    id="outlined-required"
                    label="Username"
                    margin="normal"
                    variant="outlined"
                    value={username}
                    onChange={this.handleChange}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="Password"
                    margin="normal"
                    variant="outlined"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  <Button
                    variant="outlined"
                    type="submit"
                    disabled={loading || this.validateForm()}
                  >
                    Submit
                  </Button>
                  {error && <Error error={error} />}
                </form>
              </Card>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);
