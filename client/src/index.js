import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import * as serviceWorker from "./serviceWorker";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import Home from "./components/Home/Home";
import Admin from "./components/Admin/Admin";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";
import Signout from "./components/Auth/Signout";
import "react-image-lightbox/style.css";
import "./components/Home/Home.scss";
import "./components/Article/Article.scss";
import "./components/Player/Player.scss";
import "./components/Admin/Admin.scss";
import "./components/Admin/UploadImage.scss";
import "./components/Admin/AddArticle.scss";
import "./components/Admin/RemoveArticle.scss";
import "./components/Admin/HandleArticle.scss";
import "./components/Auth/Sign.scss";
import "./components/SnackBar/SnackBar.scss";
import "./index.scss";

const link = createUploadLink({ uri: "http://vps639278.ovh.net/graphql" });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      authorization: token
    }
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link)
});

const Root = ({ refetch, session }) => {
  return (
    <Router>
      <Fragment>
        <Signout session={session} />
        <Route path="/" component={Home} exact />
        <Route
          path="/admin"
          exact
          render={() => <Signin session={session} refetch={refetch} />}
        />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route
          path="/admin/backoffice"
          render={() => <Admin session={session} />}
        />
      </Fragment>
    </Router>
  );
};

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
