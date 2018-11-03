const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  number: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

ChapterSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Chapter", ChapterSchema);
