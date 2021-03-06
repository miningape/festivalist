const { Schema } = require("mongoose");

const festivalSchema = new Schema( {
    description: {
        name: String,
        type: String,
        location: String,
        lineup: String,
    },

    LOCATION: [String],
    TYPE: [String],

    coords: {
        lat: Number,
        lng: Number
    }
}, {typeKey: "$type"} );

exports.festivalSchema = festivalSchema;
