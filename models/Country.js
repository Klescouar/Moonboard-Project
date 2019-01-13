const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  country: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

CountrySchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Country", CountrySchema);
