const mongoose = require("mongoose");

const adSchema = mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Ad", adSchema);
