const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorScema = new Schema({
    first_name: { type: String, required: true, maxLength: 100},
    last_name: { type: String, required: true, maxLength: 100},
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
});

//virtual field for full name called "name"
authorScema.virtual("name").get( function () {
    let fullName = "";

    if(this.first_name && this.last_name) fullName = `${this.last_name}, ${this.first_name}`;

    return fullName;
});

//virtual field for author's url path
authorScema.virtual("url").get( function () {
    return `/catalog/author/${this._id}`;
});

authorScema.virtual("date_of_birth_formatted").get( function () {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : "";
});

authorScema.virtual("date_of_death_formatted").get( function () {
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : "";
});

//export mongodb collection / mongoose model
module.exports = mongoose.model("Author", authorScema);