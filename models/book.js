const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true},
    summary: { type: String, required: true},
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }]
});

//virtual field for book's url path
bookSchema.virtual("url").get( function () {
    return `/catalog/book/${this._id}`;
});

//export mongodb collection / mongoose model
module.exports = mongoose.model("Book", bookSchema);