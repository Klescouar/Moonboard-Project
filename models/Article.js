const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

ArticleSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model('Article', ArticleSchema);
