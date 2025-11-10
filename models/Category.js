
const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    types: {
        type: String,
        enum: [ "radio", "selectbox", "range" ],
        required: true,
    },
    options: {
        type: [String],
        validate: {
            validator: (value) => Array.isArray(value),
            message: 'Options must be an array of strings',
        },
    },
    min: Number,
    max: Number,
});

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    description: {
        type: String,
        trim: true,
    },
    icon: {
        filename: { type: String, trim: true },
        path: { type: String, trim: true },
    },
    fillters: [filterSchema],
}, { timestamps: true });

const model = mongoose.model("Category", categorySchema);
module.exports = model;