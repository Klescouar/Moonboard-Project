import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import './components/Home/Home.scss';
import './components/Article/Article.scss';
import './components/Player/Player.scss';
import './components/Admin/ListItems.scss';
import './components/Admin/Admin.scss';
import './components/Admin/UploadImage.scss';
import './components/Admin/AddArticle.scss';
import './components/Admin/RemoveArticle.scss';
import './index.scss';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Route path="/" component={Home} exact />
        <Route path="/admin" component={Admin} />
      </Fragment>
    </Router>
  );
};

export default App;
