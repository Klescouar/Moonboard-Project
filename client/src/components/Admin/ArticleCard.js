import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class ArticleCard extends Component {
  render() {
    const {
      article,
      deleteArticle,
      attrs,
      removeArticleDialog,
      handleAction
    } = this.props;

    return (
      <Card className="RemoveArticle__Articles__Article__Card">
        <CardMedia
          className="RemoveArticle__Articles__Article__Card__Image"
          image={require(`../../assets/images/${article.image}`)}
          title="Contemplative Reptile"
        />
        <CardContent className="RemoveArticle__Articles__Article__Card__Content">
          <Typography
            gutterBottom
            variant="headline"
            component="h2"
            className="RemoveArticle__Articles__Article__Card__Content__Title"
          >
            {article.title}
          </Typography>
          <Typography component="p">{article.description}</Typography>
        </CardContent>
        <CardActions className="RemoveArticle__Articles__Article__Card__Action">
          <Button
            size="small"
            onClick={() => handleAction(deleteArticle, removeArticleDialog)}
            color="primary"
            variant="outlined"
            className="RemoveArticle__Articles__Article__Card__Action__Button"
          >
            {attrs.loading ? 'deleting...' : 'DELETE'}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default ArticleCard;
